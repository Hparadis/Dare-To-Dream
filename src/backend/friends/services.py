# src/backend/friends/services.py
def find_best_friend_match(current_user_data, other_users):
    best_match = None
    best_score = -1

    for user in other_users:
        score = 0
        if user.get("problem") == current_user_data.get("problem"):
            score += 1
        if user.get("cause") == current_user_data.get("cause"):
            score += 1

        if score > best_score:
            best_score = score
            best_match = user

    return best_match
