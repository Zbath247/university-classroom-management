const https = require('https');
const fs = require('fs');

const spreadsheetId = '1R45rjIG9yiOk9tN-rMQ8QihfFQl0Ps8PWXQ3lDId6zw';
const gids = ['70146045', '124799847', '1752201142'];

function fetchCsv(gid) {
  return new Promise((resolve, reject) => {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    function doGet(targetUrl) {
      https.get(targetUrl, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return doGet(res.headers.location);
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ gid, data }));
      }).on('error', reject);
    }
    doGet(url);
  });
}

async function run() {
  for (const gid of gids) {
    const { data } = await fetchCsv(gid);
    fs.writeFileSync(`database/sheet_${gid}.csv`, data, 'utf8');
    console.log(`=== GID: ${gid} (length: ${data.length}) ===`);
    const lines = data.split(/\r?\n/).filter(l => l.trim());
    console.log('Header lines:');
    lines.slice(0, 10).forEach((l, i) => console.log(`  [${i}] ${l}`));
    console.log(`Total non-empty lines: ${lines.length}`);
  }
}

run().catch(console.error);
