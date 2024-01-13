const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');

app.use(cors());

app.post('/ask', (req, res) => {
    const { question } = req.body;
    const answer = question
        .split('')
        .reverse()
        .join('');
    res.json({ answer });
    });