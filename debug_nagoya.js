
const https = require('https');

const OVERPASS_HOST = 'overpass-api.de';
const OVERPASS_PATH = '/api/interpreter';

// Nagoya approx bounds
const south = 35.10;
const west = 136.80;
const north = 35.25;
const east = 137.05;

const query = `
    [out:json][timeout:25];
    (
        node["leisure"="dog_park"](${south},${west},${north},${east});
        way["leisure"="dog_park"](${south},${west},${north},${east});
        relation["leisure"="dog_park"](${south},${west},${north},${east});
    );
    out body;
`;

const postData = 'data=' + encodeURIComponent(query);

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
        if (res.statusCode !== 200) {
            console.error(`Error: ${res.statusCode}`);
            return;
        }
        try {
            const json = JSON.parse(data);
            console.log(`Found ${json.elements.length} elements.`);
            json.elements.forEach(el => {
                if (!el.tags || !el.tags.name) {
                    console.log("---------------------------------------------------");
                    console.log(`Nameless Spot ID: ${el.id} (${el.type})`);
                    console.log("Tags:", JSON.stringify(el.tags, null, 2));
                } else {
                    console.log(`Named Spot: ${el.tags.name}`);
                }
            });
        } catch (e) {
            console.error(e);
        }
    });
});

req.on('error', (e) => console.error(e));
req.write(postData);
req.end();
