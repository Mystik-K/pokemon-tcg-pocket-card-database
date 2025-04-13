import os
import json
import requests
import sys
import time

if len(sys.argv) != 2:
    print("❗ Usage: python sync_set_images.py <set-code> (e.g., a1a, a2b)")
    sys.exit(1)

target_set = sys.argv[1].lower()
print(f"\n🔍 Syncing only set: {target_set.upper()}")

# Load cards
with open("data/all_cards.json", "r") as f:
    all_cards = json.load(f)

base_url = "https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/pocket"
base_image_dir = "images"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://pocket.limitlesstcg.com/"
}

success = 0
skipped = 0
failures = []

for card in all_cards:
    card_id = card["id"].lower()
    set_code, num = card_id.split("-")
    if set_code != target_set:
        continue

    set_upper = set_code.upper()
    num_padded = num.zfill(3)

    # Folder/filename rules
    if set_code == "a1a":
        folder = "A1"
        global_num = int(num) + 284
        file_name = f"A1_{str(global_num).zfill(3)}_EN.webp"
    elif set_code == "a2a":
        folder = "A2A"
        file_name = f"A2A_{num_padded}_EN.webp"
    elif set_code == "a2b":
        folder = "A2B"
        file_name = f"A2B_{num_padded}_EN.webp"
    elif set_code == "a1":
        folder = "A1"
        file_name = f"A1_{num_padded}_EN.webp"
    elif set_code == "a2":
        folder = "A2"
        file_name = f"A2_{num_padded}_EN.webp"
    else:
        folder = set_upper
        file_name = f"{set_upper}_{num_padded}_EN.webp"

    img_url = f"{base_url}/{folder}/{file_name}"
    out_dir = os.path.join(base_image_dir, set_code)
    os.makedirs(out_dir, exist_ok=True)
    dest_path = os.path.join(out_dir, f"{card_id}.webp")

    if os.path.exists(dest_path):
        print(f"🟡 {card_id} already exists, skipping")
        skipped += 1
        continue

    try:
        res = requests.get(img_url, headers=headers)
        if res.status_code != 200:
            raise Exception(f"Status {res.status_code}")
        with open(dest_path, "wb") as f:
            f.write(res.content)
        print(f"✅ {card_id} downloaded")
        success += 1
    except Exception as e:
        print(f"❌ {card_id} failed: {e}")
        failures.append(card_id)

    # Respectful scraping
    time.sleep(0.2)

# Summary
print(f"\n🎯 Set: {target_set.upper()}")
print(f"✅ Downloaded: {success}")
print(f"🟡 Skipped: {skipped}")
if failures:
    print(f"⚠️  Failed ({len(failures)}): {failures}")

