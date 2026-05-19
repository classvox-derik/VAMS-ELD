import fitz
import glob
import re
import hashlib
import json
import os

pdf_files = glob.glob(r"c:\VAMS-ELD\*.pdf")

# Map of hashes to domain level
HASH_MAP = {
    '181ad2c19d8ed067b26cc916a1a3d975': 'Beginning to Develop',
    '9fafa2b4c1620c2a360731e58e600950': 'Somewhat/Moderately',
    'bc56781d44f436de28ada2cac501b403': 'Well Developed'
}

students = {}

def get_hash(image_bytes):
    return hashlib.md5(image_bytes).hexdigest()

for pdf_path in pdf_files:
    print(f"Processing {os.path.basename(pdf_path)}...")
    doc = fitz.open(pdf_path)
    
    current_student = None
    
    for i in range(len(doc)):
        page = doc[i]
        text = page.get_text("text")
        
        # Look for SSID
        ssid_match = re.search(r"SSID:\s*(\d+)", text)
        if ssid_match:
            # We only want the English page (page 1). Usually the English page says "FOR THE FAMILY OF:"
            if "FOR THE FAMILY OF:" in text:
                ssid = ssid_match.group(1)
                name_match = re.search(r"FOR THE FAMILY OF:\n(.*?)\n", text)
                grade_match = re.search(r"Grade:\s*(\w+)", text)
                
                name = name_match.group(1).strip() if name_match else "Unknown"
                grade = grade_match.group(1).strip() if grade_match else "Unknown"
                
                current_student = {
                    "name": name,
                    "ssid": ssid,
                    "grade": grade,
                    "file": os.path.basename(pdf_path)
                }
                students[ssid] = current_student
                continue # we will process their scores on the next page (i+1)
        
        # If we have a current student, the next page should be their page 2
        if current_student and ("Score History" in text or "Overall Score" in text) and not "Puntaje global" in text:
            # Try to get overall score and level from Score History text
            # Usually it says "Grade Grade 3 Grade 4 Grade 5\nScore 1482 1507 1521\nLevel Level 2 Level 3 Level 3"
            # Since the number of grades can vary, we should look for "Score" and "Level" lines
            grade_str = current_student["grade"]
            
            lines = text.split('\n')
            score_history_idx = -1
            for idx, line in enumerate(lines):
                if "Score History" in line:
                    score_history_idx = idx
                    break
            
            if score_history_idx != -1:
                # we expect something like:
                # Grade Grade 3 Grade 4 Grade 5
                # Score 1482 1507 1521
                # Level Level 2 Level 3 Level 3
                for idx in range(score_history_idx, min(score_history_idx + 10, len(lines))):
                    if lines[idx].startswith("Score"):
                        parts = lines[idx].split()
                        if len(parts) > 1:
                            current_student["scale_score"] = int(parts[-1])
                    elif lines[idx].startswith("Level") and "Level 1" not in lines[idx] and "Level 2" not in lines[idx] and "Level 3" not in lines[idx] and "Level 4" not in lines[idx]:
                        # wait, "Level Level 2 Level 3 Level 3"
                        parts = lines[idx].split("Level")
                        levels = [p.strip() for p in parts if p.strip().isdigit()]
                        if len(levels) > 0:
                            current_student["level"] = int(levels[-1])

            # Also check images for domains
            images = page.get_image_info(xrefs=True)
            for img in images:
                if img["width"] == 588 and img["height"] == 80:
                    x0, y0, x1, y1 = img["bbox"]
                    xref = img["xref"]
                    base_image = doc.extract_image(xref)
                    h = get_hash(base_image["image"])
                    
                    domain_val = HASH_MAP.get(h, "Unknown")
                    
                    if x0 < 300 and y0 < 600:
                        current_student["listening"] = domain_val
                    elif x0 > 300 and y0 < 600:
                        current_student["reading"] = domain_val
                    elif x0 < 300 and y0 > 600:
                        current_student["speaking"] = domain_val
                    elif x0 > 300 and y0 > 600:
                        current_student["writing"] = domain_val
            
            # Reset current student so we don't overwrite if there are multiple pages
            current_student = None

with open(r"c:\VAMS-ELD\parsed_elpac_scores.json", "w") as f:
    json.dump(students, f, indent=2)

print(f"Parsed {len(students)} students.")
