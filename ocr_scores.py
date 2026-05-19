import fitz
import pytesseract
from PIL import Image
import glob
import re
import json
import os

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

pdf_files = glob.glob(r"c:\VAMS-ELD\*.pdf")

json_path = r"c:\VAMS-ELD\src\data\elpac-scores.json"
with open(json_path, "r") as f:
    student_data = json.load(f)

# Create a mapping of SSID to student data
# We'll use this to know which students we still need
students_found = 0

for pdf_path in pdf_files:
    print(f"Processing {os.path.basename(pdf_path)}...")
    doc = fitz.open(pdf_path)
    
    current_student_ssid = None
    
    for i in range(len(doc)):
        page = doc[i]
        text = page.get_text("text")
        
        # Look for SSID
        ssid_match = re.search(r"SSID:\s*(\d+)", text)
        if ssid_match and "FOR THE FAMILY OF:" in text:
            ssid = ssid_match.group(1)
            if ssid in student_data:
                current_student_ssid = ssid
            continue
            
        # The page immediately following the English Page 1 is English Page 2
        if current_student_ssid and ("Score History" in text or "Overall Score" in text) and not "Puntaje global" in text:
            # We found page 2 for this student
            pix = page.get_pixmap()
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            
            oral_crop = img.crop((100, 430, 300, 480))
            written_crop = img.crop((350, 430, 550, 480))
            
            oral_text = pytesseract.image_to_string(oral_crop, config='--psm 7 -c tessedit_char_whitelist=0123456789').strip()
            written_text = pytesseract.image_to_string(written_crop, config='--psm 7 -c tessedit_char_whitelist=0123456789').strip()
            
            if oral_text.isdigit():
                student_data[current_student_ssid]["oral_score"] = int(oral_text)
            if written_text.isdigit():
                student_data[current_student_ssid]["written_score"] = int(written_text)
            
            print(f"Student {student_data[current_student_ssid]['name']}: Oral {oral_text}, Written {written_text}")
            
            students_found += 1
            current_student_ssid = None # Reset so we don't do it again for Spanish page

with open(json_path, "w") as f:
    json.dump(student_data, f, indent=2)

print(f"Updated {students_found} students with OCR scores.")
