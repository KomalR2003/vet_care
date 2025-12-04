const http = require('http');

const post = (path, data, token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api' + path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(data))
            }
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        req.on('error', reject);
        req.write(JSON.stringify(data));
        req.end();
    });
};

const get = (path, token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api' + path,
            method: 'GET',
            headers: {}
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
};

const run = async () => {
    try {
        const email = `test${Date.now()}@example.com`;
        const password = 'password123';

        console.log('1. Registering user...');
        const regRes = await post('/register', {
            name: 'Test User',
            email,
            password,
            role: 'pet owner'
        });
        console.log('Register status:', regRes.status);

        console.log('2. Logging in...');
        const loginRes = await post('/login', { email, password });
        console.log('Login status:', loginRes.status);

        if (loginRes.status !== 200) {
            console.error('Login failed:', loginRes.data);
            return;
        }

        const token = loginRes.data.token;
        console.log('Token received');

        console.log('3. Creating pet...');
        const petRes = await post('/pets', {
            name: 'TestPet',
            species: 'Dog',
            breed: 'Lab',
            age: 2,
            weight: 10
        }, token);
        console.log('Create Pet status:', petRes.status);

        if (petRes.status !== 201) {
            console.error('Create Pet failed:', petRes.data);
        }

        console.log('4. Getting pets...');
        const getRes = await get('/pets', token);
        console.log('Get Pets status:', getRes.status);
        console.log('Pets found:', getRes.data.length);
        if (getRes.data.length > 0) {
            console.log('First pet name:', getRes.data[0].name);
        }

    } catch (err) {
        console.error('Test failed:', err);
    }
};

run();
