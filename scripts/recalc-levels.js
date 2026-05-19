const fs = require('fs');

const dataPath = 'c:\\VAMS-ELD\\src\\data\\elpac-scores.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function getLevel(grade, score) {
  if (grade === 5) {
    if (score <= 1466) return 1;
    if (score <= 1513) return 2;
    if (score <= 1559) return 3;
    return 4;
  }
  if (grade === 6) {
    if (score <= 1474) return 1;
    if (score <= 1516) return 2;
    if (score <= 1566) return 3;
    return 4;
  }
  if (grade === 7) {
    if (score <= 1480) return 1;
    if (score <= 1526) return 2;
    if (score <= 1575) return 3;
    return 4;
  }
  if (grade === 8) {
    if (score <= 1485) return 1;
    if (score <= 1533) return 2;
    if (score <= 1589) return 3;
    return 4;
  }
  return null;
}

for (const key in data) {
  const student = data[key];
  const newLevel = getLevel(student.grade, student.elpac_score);
  if (newLevel !== null) {
    student.elpac_level = newLevel;
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('Updated elpac-scores.json');
