async function verifyStudent() {
  const res = await fetch('http://localhost:3000/student');
  console.log('HTTP Status:', res.status);
  const html = await res.text();
  console.log('HTML Length:', html.length);
  console.log('Contains Welcome back:', html.includes('Welcome back'));
  console.log('Contains Success Score:', html.includes('Success Score') || html.includes('Score'));
  console.log('Contains How to Improve:', html.includes('How to Improve') || html.includes('Action Plan'));
  console.log('Contains 7 Success Indicators:', html.includes('Success Indicators') || html.includes('Indicators'));
  console.log('Contains Anonymous Voice / Grievance:', html.includes('Anonymous') || html.includes('Grievance'));
  console.log('Contains Coding Profiles:', html.includes('LeetCode') || html.includes('Coding'));
  console.log('Contains Guided Story Floating Button:', html.includes('Guided Story') || html.includes('Recovery'));
}

verifyStudent();
