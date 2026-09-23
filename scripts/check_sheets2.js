const https = require('https');
const fs = require('fs');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(get(res.headers.location));
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const html = await get('https://docs.google.com/spreadsheets/d/1R45rjIG9yiOk9tN-rMQ8QihfFQl0Ps8PWXQ3lDId6zw/edit?usp=sharing');
  fs.writeFileSync('scripts/sheet_raw.html', html, 'utf8');
  
  // Find lines containing wlj
  const lines = html.split('\n');
  for (const line of lines) {
    if (line.includes('bootstrapData') || line.includes('wlj') || line.includes('sheet-tab')) {
      console.log('Match found in line of length:', line.length);
      const parts = line.match(/"([^"]{3,30})",\d+,\d+,\d+/g);
      if (parts) console.log(parts);
    }
  }

  // Look for any Khmer text representing sheet names or "G1-" or "Group"
  const tabNames = html.match(/\[\d+,"([^"]+)",\d+,\d+/g);
  if (tabNames) {
    console.log('Tab names candidate:', tabNames);
  }
}

main().catch(console.error);
