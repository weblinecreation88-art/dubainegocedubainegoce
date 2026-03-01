"""
Script d'upload automatique vers Cloudinary
Uploade toutes les images du dossier local et retourne les URLs finales
"""
import os
import json
import urllib.request
import urllib.parse
import hashlib
import time
import hmac

# ===================== CONFIGURATION =====================
CLOUD_NAME = "dzntnjtkc"           # Ton cloud name (déjà connu)
API_KEY    = ""                    # <-- Colle ta clé API ici (Cloudinary Dashboard → Settings → API Keys)
API_SECRET = ""                    # <-- Colle ton API Secret ici

IMAGE_FOLDER = r"C:\Users\abder\OneDrive\Images\DUBAINGOCE IMAGE"
UPLOAD_FOLDER = "parfums"          # Dossier Cloudinary de destination
# =========================================================

def sign(params: dict, secret: str) -> str:
    """Génère la signature Cloudinary."""
    to_sign = "&".join(f"{k}={v}" for k, v in sorted(params.items()))
    return hashlib.sha1((to_sign + secret).encode()).hexdigest()

def upload_image(file_path: str) -> str | None:
    """Uploade une image et retourne l'URL sécurisée."""
    timestamp = str(int(time.time()))
    params = {
        "folder": UPLOAD_FOLDER,
        "timestamp": timestamp,
    }
    signature = sign(params, API_SECRET)

    url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload"

    boundary = "----CloudinaryBoundary"
    body_parts = []

    fields = {
        "api_key": API_KEY,
        "timestamp": timestamp,
        "signature": signature,
        "folder": UPLOAD_FOLDER,
    }
    for key, value in fields.items():
        body_parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{key}\"\r\n\r\n{value}\r\n")

    with open(file_path, "rb") as f:
        file_bytes = f.read()
    filename = os.path.basename(file_path)
    ext = filename.rsplit(".", 1)[-1].lower()
    mime_map = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
                "webp": "image/webp", "avif": "image/avif"}
    mime = mime_map.get(ext, "application/octet-stream")

    body_str = "".join(body_parts).encode()
    file_part = (
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{filename}\"\r\n"
        f"Content-Type: {mime}\r\n\r\n"
    ).encode() + file_bytes + b"\r\n"
    body = body_str + file_part + f"--{boundary}--\r\n".encode()

    req = urllib.request.Request(url, data=body)
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")

    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read().decode())
            return result.get("secure_url")
    except Exception as e:
        print(f"  ERREUR: {e}")
        return None

def main():
    if not API_KEY or not API_SECRET:
        print("❗ Remplis API_KEY et API_SECRET en haut du script avant de le lancer !")
        return

    exts = (".jpg", ".jpeg", ".png", ".webp", ".avif")
    files = [f for f in os.listdir(IMAGE_FOLDER) if f.lower().endswith(exts)]
    print(f"🔍 {len(files)} images trouvées dans le dossier\n")

    results = {}
    for filename in sorted(files):
        path = os.path.join(IMAGE_FOLDER, filename)
        name_no_ext = os.path.splitext(filename)[0]
        print(f"⬆️  Upload : {filename}")
        url = upload_image(path)
        if url:
            print(f"  ✅ {url}")
            results[name_no_ext] = url
        else:
            print(f"  ❌ Échec pour {filename}")

    print("\n\n=== RÉSULTATS (copie dans data.ts) ===")
    for name, url in results.items():
        print(f'{name!r}: "{url}"')

if __name__ == "__main__":
    main()
