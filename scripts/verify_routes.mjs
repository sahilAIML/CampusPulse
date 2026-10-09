async function testRoutes() {
  const routes = ['/', '/admin', '/faculty', '/student', '/announcements', '/placements', '/login'];
  for (const r of routes) {
    try {
      const res = await fetch(`http://localhost:3000${r}`);
      console.log(`Route ${r}: status ${res.status}, length ${ (await res.text()).length }`);
    } catch (e) {
      console.error(`Route ${r} error:`, e.message);
    }
  }
}

testRoutes();
