import os
import requests

set_code = "P-A"
output_dir = f"images/{set_code.lower()}"
os.makedirs(output_dir, exist_ok=True)

failed = []

for i in range(1, 69):  # A2a goes from 001 to 091 (91 cards)
    num = str(i).zfill(3)
    url = f"https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/pocket/{set_code}/{set_code}_{num}_EN.webp"
    out_path = os.path.join(output_dir, f"{set_code.lower()}-{num}.webp")

    headers = {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://pocket.limitlesstcg.com/"
    }

    res = requests.get(url, headers=headers)

    if res.status_code == 200:
        with open(out_path, 'wb') as f:
            f.write(res.content)
        print(f"✅ Downloaded: {out_path}")
    else:
        print(f"❌ Failed: {set_code}-{num} ({res.status_code})")
        failed.append(f"{set_code}-{num}")

print(f"\n🎉 Done! Downloaded {91 - len(failed)} / 91 images.")
if failed:
    print(f"⚠️  Failed: {failed}")

