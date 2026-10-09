async function verify() {
  try {
    const res = await fetch('http://localhost:3000/admin');
    console.log('HTTP Status:', res.status);
    const html = await res.text();
    console.log('HTML Length:', html.length);
    console.log('Contains Institutional Governance:', html.includes('Institutional Governance'));
    console.log('Contains Profile Lookup:', html.includes('Profile Lookup') || html.includes('FAC'));
    console.log('Contains Score Weight Tuning:', html.includes('Score Weight') || html.includes('Tuning'));
    console.log('Contains CSV Importer:', html.includes('CSV') || html.includes('Importer'));
    console.log('Contains Audit:', html.includes('Audit') || html.includes('Compliance'));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

verify();
