import json

existing_path = r"c:\VAMS-ELD\src\data\elpac-scores.json"
parsed_path = r"c:\VAMS-ELD\parsed_elpac_scores.json"

with open(existing_path, "r") as f:
    existing_data = json.load(f)

with open(parsed_path, "r") as f:
    parsed_data = json.load(f)

for ssid, data in existing_data.items():
    if ssid in parsed_data:
        p_data = parsed_data[ssid]
        if "listening" in p_data:
            data["listening"] = p_data["listening"]
        if "speaking" in p_data:
            data["speaking"] = p_data["speaking"]
        if "reading" in p_data:
            data["reading"] = p_data["reading"]
        if "writing" in p_data:
            data["writing"] = p_data["writing"]

with open(existing_path, "w") as f:
    json.dump(existing_data, f, indent=2)

print("Updated existing json with domains.")
