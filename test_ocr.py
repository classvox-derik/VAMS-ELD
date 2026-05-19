import fitz
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

img = Image.open(r"c:\VAMS-ELD\page2.png")
text = pytesseract.image_to_string(img)

print("OCR Text:")
print("---")
# Look for numbers
for line in text.split('\n'):
    if "1542" in line or "1500" in line:
        print("FOUND:", line.strip())
print("---")
