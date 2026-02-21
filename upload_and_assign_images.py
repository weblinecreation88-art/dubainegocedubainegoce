import os
import requests
from requests.auth import HTTPBasicAuth

# ================= CONFIGURATION =================
SITE_URL = "https://www.refonte.dubainegoce.fr.frenchavenue.net"
IMAGE_FOLDER = r"C:\WC_IMAGES_OK"

# WooCommerce API Keys (pour lire et mettre à jour les produits)
WC_CONSUMER_KEY = ""
WC_CONSUMER_SECRET = ""

# Utilisateur et Mot de Passe d'Application WordPress (pour uploader les images locales)
# Utilisateurs -> Profil -> Mots de passe d'application dans WordPress
WP_USER = ""
WP_APP_PASSWORD = ""
# =================================================

def upload_image_to_wp(file_path):
    print(f"Envoi de : {file_path}")
    url = f"{SITE_URL}/wp-json/wp/v2/media"
    
    file_name = os.path.basename(file_path)
    try:
        with open(file_path, 'rb') as f:
            file_bytes = f.read()
    except Exception as e:
        print(f"❌ Erreur lecture fichier: {e}")
        return None
    
    # Types MIME basiques
    ext = file_name.lower().split('.')[-1]
    content_types = {
        'jpg': 'image/jpeg', 'jpeg': 'image/jpeg',
        'png': 'image/png', 'webp': 'image/webp'
    }
    content_type = content_types.get(ext, 'application/octet-stream')

    headers = {
        'Content-Type': content_type,
        'Content-Disposition': f'attachment; filename="{file_name}"'
    }
    
    # Authentification avec Mot de passe d'application (obligatoire pour /wp/v2/media)
    auth = HTTPBasicAuth(WP_USER, WP_APP_PASSWORD)
    response = requests.post(url, headers=headers, data=file_bytes, auth=auth)
    
    if response.status_code == 201:
        media_id = response.json().get('id')
        print(f"✅ Image téléversée (ID Media: {media_id})")
        return media_id
    else:
        print(f"❌ Échec de l'upload. Erreur {response.status_code}: {response.text}")
        return None

def find_product_by_sku(sku):
    url = f"{SITE_URL}/wp-json/wc/v3/products"
    params = {'sku': sku}
    # Authentification avec clés WooCommerce (Basic Auth)
    auth = HTTPBasicAuth(WC_CONSUMER_KEY, WC_CONSUMER_SECRET)
    
    response = requests.get(url, params=params, auth=auth)
    if response.status_code == 200:
        products = response.json()
        if len(products) > 0:
            return products[0]['id']
    return None

def update_product_image(product_id, media_id):
    url = f"{SITE_URL}/wp-json/wc/v3/products/{product_id}"
    auth = HTTPBasicAuth(WC_CONSUMER_KEY, WC_CONSUMER_SECRET)
    data = {"images": [{"id": media_id}]}
    
    response = requests.put(url, json=data, auth=auth)
    if response.status_code == 200:
        print(f"✅ Image assignée avec succès au produit (ID: {product_id}) !")
        return True
    else:
        print(f"❌ Erreur lors de l'assignation au produit: {response.status_code}")
        return False

def main():
    if not WC_CONSUMER_KEY or not WP_USER:
        print("❗ VEUILLEZ RENSEIGNER LES CLÉS DANS LE SCRIPT AVANT DE LE LANCER !")
        return

    if not os.path.exists(IMAGE_FOLDER):
        print(f"❗ Le dossier local '{IMAGE_FOLDER}' est introuvable. Veuillez vérifier que le renommage a bien été effectué.")
        return

    files = [f for f in os.listdir(IMAGE_FOLDER) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    print(f"🔎 {len(files)} images trouvées dans {IMAGE_FOLDER}")

    for file_name in files:
        sku = os.path.splitext(file_name)[0]
        file_path = os.path.join(IMAGE_FOLDER, file_name)
        
        print(f"\n--- SKUs : {sku} ---")
        
        product_id = find_product_by_sku(sku)
        if not product_id:
            print(f"⚠️ Aucun produit trouvé avec le SKU : {sku}")
            continue
            
        print(f"Produit WooCommerce trouvé (ID: {product_id})")
        media_id = upload_image_to_wp(file_path)
        
        if media_id:
            update_product_image(product_id, media_id)
            
if __name__ == "__main__":
    main()
