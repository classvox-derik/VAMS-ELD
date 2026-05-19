import fitz
import hashlib

pdf_path = r"c:\VAMS-ELD\5th Grade ELPAC.pdf"
doc = fitz.open(pdf_path)

for page_idx in range(1, min(10, len(doc)), 2):  # Pages 1, 3, 5, 7, 9 (0-indexed, so 2nd, 4th, 6th pages of the PDF which are the score pages)
    page = doc[page_idx]
    print(f"\n--- PAGE {page_idx} ---")
    
    images = page.get_images()
    print(f"Total images: {len(images)}")
    for i, img in enumerate(images):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        width = base_image["width"]
        height = base_image["height"]
        # Only print hashes for images of size ~ 163x22? Wait, the size in pixels might be different from bbox size in points.
        if width > 100:
            h = hashlib.md5(image_bytes).hexdigest()
            print(f"Image xref {xref}: {width}x{height}, Hash: {h[:10]}")
