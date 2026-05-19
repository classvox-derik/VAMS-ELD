import fitz

pdf_path = r"c:\VAMS-ELD\5th Grade ELPAC.pdf"
doc = fitz.open(pdf_path)
page = doc.load_page(1)
pix = page.get_pixmap()
pix.save(r"c:\VAMS-ELD\page2.png")
