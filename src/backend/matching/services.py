# src/backend/matching/services.py
from datetime import datetime
from firebase_admin import firestore
from src.config.firebase import db
from .keywords import extract_keywords

FEELINGS_COLLECTION = "Feelings"
MAX_ARRAY_CONTAINS_ANY = 10  # Firestore's hard limit for this operator


def _find_best_match(user_id: str, keywords: list):
    """
    Per the doc: 'match the user who share the most words.'
    Looks at everyone still 'waiting' and returns whoever overlaps the most
    with this submission. Returns None if nobody shares a single word.
    """
    if not keywords:
        return None

    probe = keywords[:MAX_ARRAY_CONTAINS_ANY]

    # NOTE: this compound query (equality + array_contains_any) needs a
    # Firestore composite index. The first time you run this, Firestore
    # will throw a FailedPrecondition error with a direct link to create
    # it — click it once and the index builds itself.
    candidates = (
        db.collection(FEELINGS_COLLECTION)
        .where("status", "==", "waiting")
        .where("keywords", "array_contains_any", probe)
        .stream()
    )

    best_doc = None
    best_overlap = 0
    keyword_set = set(keywords)

    for candidate in candidates:
        if candidate.id == user_id:
            continue
        candidate_keywords = set(candidate.to_dict().get("keywords", []))
        overlap = len(keyword_set & candidate_keywords)
        if overlap > best_overlap:
            best_overlap = overlap
            best_doc = candidate

    if best_doc is None:
        return None

    return {
        "id": best_doc.id,
        "sharedKeywords": list(keyword_set & set(best_doc.to_dict().get("keywords", []))),
    }


def _notify_waiting_user(matched_user_id: str, from_user_id: str, shared_keywords: list):
    """
    Reuses the exact Invitations shape friends/routes.py already writes, so
    this shows up automatically in the existing NotificationBell /
    Notifications.jsx accept-to-become-friends flow. No new UI needed on
    the receiving end — the bell just lights up.
    """
    db.collection("Invitations").add({
        "fromUserId": from_user_id,
        "fromUserName": "Someone who feels the same way",
        "fromUserEmail": "",
        "toUserId": matched_user_id,
        "status": "pending",
        "type": "feeling_match",
        "sharedKeywords": shared_keywords,
        "message": "We found someone who's going through something similar.",
        "timestamp": datetime.utcnow().isoformat(),
    })


def submit_feeling(user_id: str, text: str) -> dict:
    """
    Stage 1 of the algorithm:
      1. Turn the text into a bag of words.
      2. Look for whoever's already waiting and shares the most words.
      3. If found: mark both as matched, notify the person who was waiting.
      4. If not: store this person as waiting so a future submitter can
         match against them, and let the bell handle the rest.
    """
    keywords = extract_keywords(text)

    if not keywords:
        return {"matched": False, "reason": "no_keywords"}

    match = _find_best_match(user_id, keywords)
    doc_ref = db.collection(FEELINGS_COLLECTION).document(user_id)

    if match:
        doc_ref.set({
            "userId": user_id,
            "text": text,
            "keywords": keywords,
            "status": "matched",
            "matchedWith": match["id"],
            "updatedAt": firestore.SERVER_TIMESTAMP,
        })
        db.collection(FEELINGS_COLLECTION).document(match["id"]).update({
            "status": "matched",
            "matchedWith": user_id,
        })
        _notify_waiting_user(match["id"], user_id, match["sharedKeywords"])

        return {
            "matched": True,
            "matchedUserId": match["id"],
            "sharedKeywords": match["sharedKeywords"],
        }

    doc_ref.set({
        "userId": user_id,
        "text": text,
        "keywords": keywords,
        "status": "waiting",
        "matchedWith": None,
        "createdAt": firestore.SERVER_TIMESTAMP,
        "updatedAt": firestore.SERVER_TIMESTAMP,
    })
    return {"matched": False, "reason": "no_match_yet"}


def cancel_waiting(user_id: str) -> dict:
    """
    Called when the person answers "No" to 'do you want to be notified if
    we find someone?' — pulls their entry out of the matching pool so
    future submitters can't match against it. Doesn't delete the record,
    just marks it out of play.
    """
    doc_ref = db.collection(FEELINGS_COLLECTION).document(user_id)
    snap = doc_ref.get()
    if snap.exists and snap.to_dict().get("status") == "waiting":
        doc_ref.update({"status": "cancelled", "updatedAt": firestore.SERVER_TIMESTAMP})
        return {"cancelled": True}
    return {"cancelled": False}
