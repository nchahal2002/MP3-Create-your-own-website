const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const pgp = require('pg-promise')();

// Database connection details
const db = pgp({
    host: 'localhost',
    port: 5432,
    database: 'your_database',
    user: 'your_username',
    password: 'your_password'
});

app.use(express.json());

app.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const result = await db.none('INSERT INTO users(username, password) VALUES($1, $2)', [req.body.username, hashedPassword]);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await db.one('SELECT * FROM users WHERE username = $1', [req.body.username]);
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success');
        } else {
            res.send('Not Allowed');
        }
    } catch {
        res.status(500).send();
    }
});

app.listen(3000);