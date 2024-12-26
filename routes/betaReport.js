// 베타테스트 후기 [prefix: /api/v1/beta]
const express = require('express');
const router = express.Router();
let db = require('../lib/db.js');

/**
 * 베타테스트 후기 저장
 */
router.post("/", async(req, res, next) => {
    const reqData = req.body;
    
    try {
        // 입력 데이터 유효성 검사
        // 01. USERNAME의 길이는 최대 100글자까지 허용
        if (reqData.username != null && reqData.username.length > 100) {
            return res.status(400).json({
                message: "용사의 이름은 최대 100글자를 넘어갈 수 없습니다."
            });
        }
        // 02. ANSWER의 길이는 최대 1,000글자까지 허용
        if ((reqData.answer1 != null && reqData.answer1.length > 1000) 
            || (reqData.answer2 != null && reqData.answer2.length > 1000) 
            || (reqData.answer3 != null && reqData.answer3.length > 1000)
            || (reqData.answer4 != null && reqData.answer4.length > 1000)
            || (reqData.answer5 != null && reqData.answer5.length > 1000))  {
            return res.status(400).json({
                message: "베타테스트 응답의 길이는 최대 1,000글자를 넘어갈 수 없습니다."
            });
        }

        const params = [reqData.username, reqData.answer1, reqData.answer2, reqData.answer3, reqData.answer4, reqData.answer5];
        const query = `
            INSERT INTO BETA_REPORT (USERNAME, ANSWER1, ANSWER2, ANSWER3, ANSWER4, ANSWER5) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await db.query(query, params);

        res.status(201).json({
            id: result.insertId // 베타테스트 후기 저장 후 Key 값
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
})

module.exports = router;