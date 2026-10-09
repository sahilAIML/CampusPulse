const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'vignan_cse_faculty.csv');
const raw = fs.readFileSync(csvPath, 'utf8');

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0].split(',').map(h => h.trim());
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Parse CSV line handling potential quotes
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const record = {};
    header.forEach((key, idx) => {
      let val = values[idx] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      record[key] = val;
    });
    records.push(record);
  }
  return records;
}

const facultyList = parseCSV(raw);
console.log('Parsed faculty records:', facultyList.length);
console.log('First record:', facultyList[0]);
console.log('Last record:', facultyList[facultyList.length - 1]);
