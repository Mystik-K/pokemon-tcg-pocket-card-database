# image_sync.py

import os
import requests
import json
from bs4 import BeautifulSoup

# Make sure this is run inside your virtual environment!
cards_file = 'data/all_cards.json'
image_dir = 'images/auto_synced'

os.makedirs(image_dir, exist_ok=True)

with open(cards_file, 'r') as f:
    cards = json.load(f)

base_card_url = "https://pocket.pokemongohub.net/en/card"
downloaded = 0
skipped = 0

for card in cards:
    name_slug = card['name'].lower().replace(' ex', '-ex').replace(' ', '-').replace('.', '').replace("'", "")
    card_id = card['id'].lower()
    card_url = f"{base_card_url}/{card_id}-{name_slug}"

    print(f"🌐 Fetching: {card_url}")
    try:
        res = requests.get(card_url)
        if res.status_code != 200:
            print(f"❌ Could not load card page for {card_id}")
            continue

        soup = BeautifulSoup(res.text, 'html.parser')
        img_tag = soup.find('img', {"alt": card['name']})
        if not img_tag:
            print(f"❌ No image tag found for {card_id}")
            continue

        img_url = img_tag['src']
        if img_url.startswith("/"):
            img_url = "https://pocket.pokemongohub.net" + img_url

        out_file = os.path.join(image_dir, f"{card_id}.jpeg")
        if os.path.exists(out_file):
            print(f"⚠️ Already exists: {card_id}")
            skipped += 1
            continue

        image = requests.get(img_url)
        with open(out_file, 'wb') as f:
            f.write(image.content)
        print(f"✅ Downloaded: {card_id}")
        downloaded += 1

    except Exception as e:
        print(f"🚨 Error downloading {card_id}: {e}")

print(f"\n🎉 Done! Downloaded: {downloaded}, Skipped: {skipped}")

