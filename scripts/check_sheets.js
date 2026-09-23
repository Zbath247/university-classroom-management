const https = require('https');

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
  
  // Look for sheet tabs in client bootstrap or bootstrap data
  const sheetNames = [];
  const re = /"name":"([^"]+)"[\s\S]*?"sheetId":(\d+)/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    sheetNames.push({ name: m[1], gid: m[2] });
  }

  console.log('Found sheets via sheetId:');
  console.log(JSON.stringify(sheetNames, null, 2));

  // Also search for class names mentioned in the document
  const matches = html.match(/(G\d-[A-Z]+-[A-Z]|Group\s*\d|NW-[AB]|CS-[AB]|IT-[AB])/gi);
  if (matches) {
    console.log('Class mentions in HTML:', [...new Set(matches)]);
  }
}

main().catch(console.error);
