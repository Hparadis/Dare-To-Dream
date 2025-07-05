# src/backend/groups/utils.py
import re

def normalize_id(name):
    return re.sub(r'[^a-zA-Z0-9_-]', '-', name.strip().lower())
