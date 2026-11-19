import os
import sys

# Ensure root directory is on the Python path so backend package can be imported
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.app.main import app, ensure_seeded

# Ensure DB tables & initial Pune demonstration data exist in serverless environment
ensure_seeded()
