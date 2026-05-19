import pdfplumber

pdf_path = r"c:\VAMS-ELD\5th Grade ELPAC.pdf"
with pdfplumber.open(pdf_path) as pdf:
    for i, page in enumerate(pdf.pages):
        print(f"--- PAGE {i} ---")
        text = page.extract_text()
        print(text)
        if i >= 1: break # only first 2 pages
