import pdfplumber

pdf_path = r"c:\VAMS-ELD\5th Grade ELPAC.pdf"
with pdfplumber.open(pdf_path) as pdf:
    p = pdf.pages[1]
    for w in p.extract_words():
        if w['text'].isdigit() and len(w['text']) == 4:
            print(f"pdfplumber: {w['text']} at ({w['x0']}, {w['top']})")
