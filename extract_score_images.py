import fitz

pdf_path = r"c:\VAMS-ELD\5th Grade ELPAC.pdf"
doc = fitz.open(pdf_path)

page = doc[0]
images = page.get_image_info(xrefs=True)
for img in images:
    if img["width"] == 225 and img["height"] == 742:
        xref = img["xref"]
        base_image = doc.extract_image(xref)
        with open(rf"c:\VAMS-ELD\score_image_{xref}.{base_image['ext']}", "wb") as f:
            f.write(base_image["image"])
        print(f"Saved score_image_{xref}.{base_image['ext']}")
