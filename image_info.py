import fitz

pdf_path = r"c:\VAMS-ELD\5th Grade ELPAC.pdf"
doc = fitz.open(pdf_path)

page = doc[1]
print("--- IMAGE INFO ---")
for img in page.get_image_info(xrefs=True):
    print(f"Xref {img['xref']}: bbox={img['bbox']}, size={img['width']}x{img['height']}")
