const express = require('express');
const router = express.Router();
const db = require('../lib/db.js');
const {v4: uuidv4} = require('uuid');

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

        const generatedUUID = uuidv4().split('-')[0];
        const params = [reqData.username, generatedUUID, reqData.game_result];
        const insertQuery = `
            INSERT INTO THANKS_CARD (USERNAME, UUID, RESULT)
            VALUES (?, ?, ?)
        `;
        await db.query(insertQuery, params);

        res.status(201).json({
            id: generatedUUID
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
})

// card message 업데이트
router.post("/update", async(req, res) => {
    const {uuid, message} = req.body;

    // 메시지 업데이트
    const updateQuery = `UPDATE THANKS_CARD SET CARD_MESSAGE = ? WHERE UUID = ?`;
    const params = [message, uuid];
    await db.query(updateQuery, params);

    // UUID로 카드 조회
    const selectQuery = `SELECT * FROM THANKS_CARD WHERE UUID = ?`;
    const [selectResult] = await db.query(selectQuery, [uuid]);

    res.json(selectResult);
})

router.get("/:uuid", async(req, res) => {
    const uuid = req.params.uuid;
    const cardQuery =  `
        SELECT * FROM THANKS_CARD WHERE UUID = ?
    `;
    const [rows] = await db.query(cardQuery, [uuid]);
    res.json(rows);
})

/**
 * 카드 불러오기: 메인 화면에서 카드 메시지 불러오기
 */
router.get("/", async(req, res) => {
    const query = 'SELECT * FROM THANKS_CARD ORDER BY REG_DATE DESC';

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
