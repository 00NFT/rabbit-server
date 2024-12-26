// Webhook 설정
const dotenv = require('dotenv');
const axios = require('axios');

// 환경변수 설정
const env = process.env.NODE_ENV || 'dev';
dotenv.config({ path: `.env.${env}` });

const webhookURL = `https://discord.com/api/webhooks/${process.env.WEBHOOK_ID}/${process.env.WEBHOOK_TOKEN}`;

/**
 * Webhook 메시지 전송 함수
 * @param {*} message : 문자열 형태로 디스코드에 보낼 메시지를 입력하면 웹훅이 전송됩니다.
 */
const sendMessage = async (message) => {
    try {
        const response = await axios.post(webhookURL, { content: message });
    } catch (error) {
        console.error('[ERROR] webhook.js sendMessage() : ', error);
    }
};

module.exports = { sendMessage };