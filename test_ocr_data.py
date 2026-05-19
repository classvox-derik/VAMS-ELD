import fitz
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

img = Image.open(r"c:\VAMS-ELD\page2.png")
data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)

print("OCR Words:")
for i in range(len(data['text'])):
    word = data['text'][i].strip()
    if word:
        print(f"Word: '{word}' at x={data['left'][i]}, y={data['top'][i]}")
