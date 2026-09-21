const https = require('https');
const fs = require('fs');

https.get('https://kamin.ae', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Write full raw body for analysis
    fs.writeFileSync('scratch/kamin_raw.html', data);

    const headings = [...data.matchAll(/<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi)]
      .map(m => m[1] + ': ' + m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
      .filter(h => h.split(': ')[1]?.length > 0);

    const links = [...data.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
      .map(m => ({ href: m[1], text: m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() }))
      .filter(l => l.text.length > 1 && l.text.length < 50 && !l.href.startsWith('#'));

    const seen = new Set();
    const uniqueLinks = links.filter(l => {
      const key = l.text + '|' + l.href;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    console.log('=== KAMIN HEADINGS ===');
    console.log(headings);
    console.log('\n=== KAMIN NAVIGATION / LINKS ===');
    console.log(uniqueLinks.slice(0, 30));
  });
}).on('error', console.error);

