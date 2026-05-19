import fitz

pdf_path = r"c:\VAMS-ELD\5th Grade ELPAC.pdf"
doc = fitz.open(pdf_path)

page = doc[0]
blocks = page.get_text("blocks")
for b in blocks:
    print(f"Block: {b[4].strip()}")
