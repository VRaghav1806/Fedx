const https = require('https');

const data = JSON.stringify({
    email: 'test@example.com',
    password: 'password'
});

const options = {
    hostname: 'fedx-1.onrender.com',
    port: 443,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Testing POST to https://fedx-1.onrender.com/api/auth/login');

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
