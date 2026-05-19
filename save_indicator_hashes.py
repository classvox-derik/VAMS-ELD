import fitz
import hashlib

pdf_path = r"c:\VAMS-ELD\5th Grade ELPAC.pdf"
doc = fitz.open(pdf_path)

seen_hashes = set()
for page_idx in range(1, 10, 2):
    page = doc[page_idx]
    for img in page.get_images():
        xref = img[0]
        base_image = doc.extract_image(xref)
        if base_image["width"] == 588 and base_image["height"] == 80:
            image_bytes = base_image["image"]
            h = hashlib.md5(image_bytes).hexdigest()
            if h not in seen_hashes:
                seen_hashes.add(h)
                ext = base_image["ext"]
                # Save to artifacts so I can see it if needed, but also save locally
                with open(rf"c:\VAMS-ELD\hash_{h}.{ext}", "wb") as f:
                    f.write(image_bytes)
                print(f"Saved hash_{h}.{ext}")

print("Done.")
