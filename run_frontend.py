"""
Run the Flask app and serve the React frontend's build files.
"""

import os
from pathlib import Path
from flask import send_from_directory, abort
from project import create_app

app = create_app()

# --- DEBUG: print current working directory ---
print(f"🔍 Current working directory: {os.getcwd()}")

# Base path where this script lives
BASE = Path(__file__).resolve().parent
print(f"📁 Script base path: {BASE}")

# --- FRONTEND build path candidates ---
candidates = [
    BASE / "FRONTEND" / "dist",    # Vite build (most common)
    BASE / "frontend" / "dist",    # lowercase fallback
    BASE / "dist",                 # direct build folder
]

build_dir = None
for c in candidates:
    print(f"🔎 Checking for build folder at: {c}")
    if c.exists():
        build_dir = c
        break

# --- Setup frontend serving ---
if build_dir is None:
    print("⚠️  No frontend build found. Please run `npm run build` inside FRONTEND folder.")
else:
    print(f"✅ Serving frontend from: {build_dir}")

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        if path.startswith("api/") or path.startswith("project/"):
            abort(404)
        full_path = build_dir / path
        if path and full_path.exists() and full_path.is_file():
            return send_from_directory(str(build_dir), path)
        index_file = build_dir / "index.html"
        if index_file.exists():
            return send_from_directory(str(build_dir), "index.html")
        abort(404)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
