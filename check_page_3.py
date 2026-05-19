import pdfplumber

pdf_path = r"c:\VAMS-ELD\5th Grade ELPAC.pdf"
with pdfplumber.open(pdf_path) as pdf:
    words = pdf.pages[3].extract_words()
    print(" ".join(w['text'] for w in words))
