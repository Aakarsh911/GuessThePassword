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

app.post('/ask/:guess/:show/:diff/:index', async (req, res) => {
    const { guess } = req.params;
    const { show } = req.params;
    const { diff } = req.params;
    const { index } = req.params;
    const { question } = req.body;
    const prompt = `Only answer yes or no. If the question cannot be answered as yes or no then answer "not a yes or no question" Here are two numbers: ${show}, ${guess} The different number is ${diff} and is located at ${index} [position] where the first digit is at position 1. The user is shown ${show} and has to guess ${guess}. The user will ask questions about the guess which is ${guess}. If asked whether the position of the different number is less than a particular number, then compare ${index} with that number. If ${index} is less only then answer yes, otherwise no. Do the same for if asked the position is more than check if ${index} is more. If asked whether the different number is greater or less than or equal to a particular number, answer by comparing ${diff} which is the different number with the particular number given. If asked is the nth number changed check if n equals ${index}. The user might user different and changed interchangeably. If asked anything about number, the number refers to ${diff} and its position is ${index}.

    Q: ${question}
    A:`;
    const requestData = {
        model: 'gpt-4',
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
