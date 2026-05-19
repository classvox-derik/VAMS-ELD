import fitz
import pdfplumber

pdf_path = r"c:\VAMS-ELD\5th Grade ELPAC.pdf"

# PyMuPDF
print("--- PyMuPDF WORDS ---")
doc = fitz.open(pdf_path)
page = doc[0]
for word in page.get_text("words"):
    if word[4].isdigit() and len(word[4]) == 4:
        print(f"PyMuPDF 4-digit word: {word[4]} at {word[:4]}")

# pdfplumber
print("\n--- pdfplumber WORDS ---")
with pdfplumber.open(pdf_path) as pdf:
    p0 = pdf.pages[0]
    for w in p0.extract_words():
        if w['text'].isdigit() and len(w['text']) == 4:
            print(f"pdfplumber 4-digit word: {w['text']} at ({w['x0']}, {w['top']})")
