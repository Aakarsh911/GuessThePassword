const { OpenAIAPI } = require('openai');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { config } = require('dotenv');
config();

const app = express();
const port = 3001;

app.listen(port, () => console.log(`Server running on port ${port}`));
app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;

app.post('/ask/:guess/:show', async (req, res) => {
    const { guess } = req.params;
    const { show } = req.params;
    const { question } = req.body;
    const prompt = `Only answer yes or no. If the question cannot be answered as yes or no then answer "not a yes or no question" The user is given this number ${show} and is told that one character is off. The user has to guess the correct 7-letter number ${guess} where only one letter is different. The different character refers to the only letter that is different between the two numbers provided.

    Q: ${question}
    A:`;
    const requestData = {
        model: 'gpt-3.5-turbo-1106',
        messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: prompt },
        ],
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        });

        const answer = response.data.choices[0].message.content;
        console.log(answer);
        res.send(answer);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
});
