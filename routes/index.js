const express = require('express');
const router = express.Router();
let db = require('../lib/db.js');

// ROOT 경로에 대한 라우터 설정
router.get('/', async (req, res, next) => {
    try {
        const result = await db.query("SELECT 'HOME' FROM DUAL");
        res.json({
            message: 'Welcome Rabbit Server!',
            results: result
        });
    } catch (error) {
        console.error(error);
        next(error); // 에러를 다음 미들웨어로 전달
    }
});

// 외부에서 사용할 수 있도록 export
module.exports = router;
