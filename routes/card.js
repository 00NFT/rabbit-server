const express = require('express');
const router = express.Router();
const db = require('../lib/db.js');

router.get("/", async (req, res, next) => {
    res.json({
        message: "card test"
    })
})

/**
 * 카드 저장
 */
router.post("/", async(req, res, next) => {
    const reqData = req.body;
    console.log(req.body)

    try {
        // 입력 데이터 유효성 검사
        // 01. USERNAME의 길이는 최대 100글자까지 허용
        if (reqData.username != null && reqData.username.length > 100) {
            return res.status(400).json({
                message: "용사의 이름은 최대 100글자를 넘어갈 수 없습니다."
            });
        }
        // 02. 응답의 길이는 최대 400글자까지 허용
        if (reqData.message != null && reqData.message.length > 400) {
            return res.status(400).json({
                message: "용사의 메시지는 최대 400글자를 넘어갈 수 없습니다."
            });
        }

        const params = [reqData.username, reqData.message];
        const query = `
            INSERT INTO THANKS_CARD (USERNAME, CARD_MESSAGE) 
            VALUES (?, ?)
        `;
        const result = await db.query(query, params);

        res.status(201).json({
            id: result.insertId // 메시지 저장 후 Key 값
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
})

/**
 * 카드 불러오기
 */
router.get("/", async(req, res) => {
    const query = 'SELECT * FROM THANKS_CARD'

    db.query(query, (err, results) => {
        if (err) {
          console.error('데이터 조회 실패:', err);
          res.status(500).send('서버 에러');
        } else {
          res.json(results);
        }
      });
});

module.exports = router;
