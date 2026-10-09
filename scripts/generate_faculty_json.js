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

const rawList = parseCSV(raw);

function cleanEmail(name, id) {
  const cleanName = name
    .toLowerCase()
    .replace(/^(dr|mr|mrs|ms|prof)\.?\s+/i, '')
    .replace(/[^a-z0-9]/g, '.')
    .replace(/\.+/g, '.')
    .replace(/^\.|\.$/g, '');
  return `${cleanName || id.toLowerCase()}@vignan.ac.in`;
}

function deriveCourses(interests, designation) {
  if (!interests) {
    if (designation === 'Professor') return ['Advanced Computer Architecture (CS401)', 'Research Methodology & Ethics (CS701)'];
    if (designation === 'Associate Professor') return ['Design & Analysis of Algorithms (CS302)', 'Operating Systems (CS304)'];
    return ['Data Structures with C++ (CS201)', 'Object Oriented Programming with Java (CS204)'];
  }
  const topics = interests.split(';').map(t => t.trim()).filter(Boolean);
  const courses = [];
  topics.slice(0, 3).forEach((t) => {
    courses.push(`${t} (Specialization CS-${Math.floor(100 + Math.random() * 400)})`);
  });
  if (courses.length === 0) {
    courses.push('Computer Science Foundations (CS201)');
  }
  return courses;
}

const sections = ['Section A', 'Section B', 'Section C'];

const facultyProfiles = rawList.map((item, idx) => {
  const idNum = parseInt(item.faculty_id.replace('CSE_', ''), 10) || (idx + 1);
  const officeRoom = 200 + (idNum % 40) + 1;
  const block = idNum % 2 === 0 ? 'Aryabhata Academic Block' : 'Vashishta Research Complex';
  
  // Predictable workload & attendance
  const baseAttendance = 92 + ((idNum * 7) % 8); // 92% to 99%
  const workload = item.designation === 'Professor' ? 14 : item.designation === 'Associate Professor' ? 16 : 18;
  const assignedSec = [sections[idNum % 3]];
  if (idNum % 4 === 0) {
    assignedSec.push(sections[(idNum + 1) % 3]);
  }

  return {
    faculty_id: item.faculty_id,
    reg_no: item.faculty_id,
    full_name: item.name,
    designation: item.designation,
    department: item.department || 'Computer Science Engineering',
    research_interests: item.research_interests || '',
    photo_url: item.photo_url,
    profile_url: item.profile_url,
    source: item.source,
    assigned_sections: assignedSec,
    attendance_pct: Number(baseAttendance.toFixed(1)),
    workload_hours_per_week: workload,
    courses_taught: deriveCourses(item.research_interests, item.designation),
    email: cleanEmail(item.name, item.faculty_id),
    avatar_url: item.photo_url || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150`,
    office_location: `${block}, Cabin ${officeRoom}`,
    cabin_hours: (idNum % 2 === 0) ? 'Mon/Wed 14:00 - 16:30' : 'Tue/Thu 10:30 - 13:00',
  };
});

const outputPath = path.join(__dirname, '..', 'lib', 'data', 'vignan_faculty.json');
fs.writeFileSync(outputPath, JSON.stringify(facultyProfiles, null, 2), 'utf8');

console.log(`Successfully generated ${facultyProfiles.length} faculty profiles at ${outputPath}`);
