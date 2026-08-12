# src/backend/matching/services.py
from datetime import datetime, timedelta, timezone
from firebase_admin import firestore
from src.config.firebase import db
from .keywords import extract_keywords

FEELINGS_COLLECTION = "Feelings"
MAX_ARRAY_CONTAINS_ANY = 10  # Firestore's hard limit for this operator
STALE_AFTER_MINUTES = 3  # a waiting entry older than this is abandoned, never matched


def _find_best_match(user_id: str, keywords: list):
    """
    Per the doc: 'match the user who share the most words.'
    Looks at everyone still matchable — "pending" (just submitted, hasn't
    opted into notify) and "waiting" (opted in after a first miss) both
    count — and returns whoever overlaps the most with this submission.
    Returns None if nobody shares a single word.
    """
    if not keywords:
        return None

    probe = keywords[:MAX_ARRAY_CONTAINS_ANY]
    now = datetime.now(timezone.utc)

    best_doc = None
    best_overlap = 0
    best_candidate_time = None
    keyword_set = set(keywords)

    # Two separate queries instead of one "in" clause — safer against
    # Firestore's restrictions on combining "in" with "array_contains_any"
    # in one query, and reuses the same composite index for both.
    for status in ("pending", "waiting"):
        candidates = (
            db.collection(FEELINGS_COLLECTION)
            .where("status", "==", status)
            .where("keywords", "array_contains_any", probe)
            .stream()
        )
        for candidate in candidates:
            if candidate.id == user_id:
                continue
            data = candidate.to_dict()

            # Skip abandoned entries — someone who submitted, closed the
            # tab, and never came back shouldn't stay matchable forever.
            updated_at = data.get("updatedAt")
            candidate_time = now  # fallback if updatedAt is missing, treated as "just now"
            if updated_at is not None:
                candidate_time = updated_at if updated_at.tzinfo else updated_at.replace(tzinfo=timezone.utc)
                if (now - candidate_time) > timedelta(minutes=STALE_AFTER_MINUTES):
                    continue

            candidate_keywords = set(data.get("keywords", []))
            overlap = len(keyword_set & candidate_keywords)
            is_better = overlap > best_overlap or (
                overlap == best_overlap
                and overlap > 0
                and best_doc is not None
                and candidate_time < best_candidate_time
            )
            if is_better:
                best_overlap = overlap
                best_doc = candidate
                best_candidate_time = candidate_time

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
        }, merge=True)
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
        "status": "pending",
        "matchedWith": None,
        "createdAt": firestore.SERVER_TIMESTAMP,
        "updatedAt": firestore.SERVER_TIMESTAMP,
    }, merge=True)
    return {"matched": False, "reason": "no_match_yet"}
def confirm_waiting(user_id: str) -> dict:
    """
    Called only when the person explicitly clicks 'Notify me when someone
    matches.' Submitting a feeling alone no longer puts you in the pool —
    only this does.
    """
    doc_ref = db.collection(FEELINGS_COLLECTION).document(user_id)
    snap = doc_ref.get()
    if snap.exists and snap.to_dict().get("status") == "pending":
        doc_ref.update({"status": "waiting", "updatedAt": firestore.SERVER_TIMESTAMP})
        return {"confirmed": True}
    return {"confirmed": False}
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
