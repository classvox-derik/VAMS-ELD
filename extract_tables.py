import pdfplumber
import glob

pdf_files = glob.glob(r"c:\VAMS-ELD\*.pdf")
for pdf_path in pdf_files[:1]:  # Just one pdf
    with pdfplumber.open(pdf_path) as pdf:
        for p in [1, 3, 5]:  # Look at page 2, 4, 6
            page = pdf.pages[p]
            tables = page.extract_tables()
            print(f"--- PAGE {p} Tables ---")
            for t in tables:
                print(t)
            print("--- PAGE Words containing 'Score' ---")
            words = page.extract_words()
            for i, w in enumerate(words):
                if 'Score' in w['text']:
                    # print context
                    context = [w['text'] for w in words[max(0, i-2):i+5]]
                    print(" ".join(context))
