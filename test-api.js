const http = require('http');

const options = {
  hostname: '192.168.1.219',
  port: 3000,
  path: '/api/cockpit?organizationId=00000000-0000-0000-0000-000000000000',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const json = JSON.parse(data);
    console.log('✅ KPIs:', json.kpis?.length || 0);
    console.log('✅ Projects:', json.projects?.length || 0);
    console.log('✅ Risks:', json.risks?.length || 0);
  });
});

req.on('error', (e) => {
  console.error('❌ ERROR:', e.message);
});

req.setTimeout(5000, () => {
  console.error('❌ TIMEOUT');
  req.abort();
});

req.end();
