const express = require('express');
const router = express.Router();

// ROOT 경로에 대한 라우터 설정
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome Rabbit Server!'
    });
});

// 외부에서 사용할 수 있도록 export
module.exports = router;
