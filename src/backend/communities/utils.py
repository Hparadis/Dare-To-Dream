# src/backend/communities/utils.py

def normalize_tags(tags: list[str]) -> list[str]:
    """Lowercase and strip tags."""
    return [t.strip().lower() for t in tags if t]

def community_summary(community: dict) -> dict:
    """Return a slimmed version of community data."""
    return {
        "id": community.get("id"),
        "name": community.get("name"),
        "description": community.get("description", ""),
        "memberCount": len(community.get("members", [])),
        "tags": community.get("tags", []),
    }
