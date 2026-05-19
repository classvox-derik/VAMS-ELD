import fitz
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

img = Image.open(r"c:\VAMS-ELD\page2.png")

oral_crop = img.crop((100, 430, 300, 480))
written_crop = img.crop((350, 430, 550, 480))

oral_text = pytesseract.image_to_string(oral_crop, config='--psm 7 -c tessedit_char_whitelist=0123456789').strip()
written_text = pytesseract.image_to_string(written_crop, config='--psm 7 -c tessedit_char_whitelist=0123456789').strip()

print(f"Oral: {oral_text}")
print(f"Written: {written_text}")
