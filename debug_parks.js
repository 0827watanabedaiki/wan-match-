
const https = require('https');

const OVERPASS_HOST = 'overpass-api.de';
const OVERPASS_PATH = '/api/interpreter';

// Nagoya bounds
const south = 35.0;
const west = 136.8;
const north = 35.3;
const east = 137.1;

const query = `
    [out:json][timeout:25];
    (
        // Search by name approx
        node["leisure"="park"]["name"~"庄内"](${south},${west},${north},${east});
        way["leisure"="park"]["name"~"庄内"](${south},${west},${north},${east});
        relation["leisure"="park"]["name"~"庄内"](${south},${west},${north},${east});

        node["leisure"="park"]["name"~"大高"](${south},${west},${north},${east});
        way["leisure"="park"]["name"~"大高"](${south},${west},${north},${east});
        relation["leisure"="park"]["name"~"大高"](${south},${west},${north},${east});
    );
    out center;
`;

const postData = 'data=' + encodeURIComponent(query);
console.log("Querying for Shonai/Odaka...");

const options = {
    hostname: OVERPASS_HOST,
    path: OVERPASS_PATH,
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log(`Found ${json.elements.length} elements.`);
            json.elements.forEach(el => {
                const tags = el.tags || {};
                const name = tags.name || '(No Name)';
                console.log(`ID: ${el.id}, Name: ${name}, Type: ${tags.leisure}, Tags: ${JSON.stringify(tags)}`);
            });
        } catch (e) {
            console.error(data);
        }
    });
});

req.on('error', (e) => console.error(e));
req.write(postData);
req.end();
