import pdfplumber

pdf_path = r"c:\VAMS-ELD\5th Grade ELPAC.pdf"
with pdfplumber.open(pdf_path) as pdf:
    page = pdf.pages[1]  # Page 2 has the domain checkmarks
    print("--- TEXT ---")
    words = page.extract_words()
    print("Words containing 'Listening':", [w for w in words if 'Listening' in w['text']])
    print("Words containing 'Reading':", [w for w in words if 'Reading' in w['text']])
    
    print("\n--- CURVES ---")
    print(f"Total curves: {len(page.curves)}")
    for i, curve in enumerate(page.curves[:10]):
        print(f"Curve {i}: pts={curve.get('pts', [])}, width={curve.get('width')}, height={curve.get('height')}")
        
    print("\n--- RECTS ---")
    print(f"Total rects: {len(page.rects)}")
    
    print("\n--- LINES ---")
    print(f"Total lines: {len(page.lines)}")
    
    print("\n--- IMAGES ---")
    print(f"Total images: {len(page.images)}")
    for i, img in enumerate(page.images):
        print(f"Image {i}: bbox=({img['x0']}, {img['top']}, {img['x1']}, {img['bottom']})")
    
    print("\n--- CHARS (possible symbol fonts) ---")
    chars = page.chars
    for c in chars:
        if c['text'] == '4' and 'fontname' in c and 'Symbol' in c['fontname']:
            print("Found checkmark as char:", c)
