// 설치한 모듈 가져오기
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

// Router 설정
const indexRouter = require('./routes/index');
const betaRouter = require('./routes/betaReport');

// 실행 환경 별 환경변수 분리
const env = process.env.NODE_ENV || 'dev';
dotenv.config({ path: `.env.${env}` });

const app = express();
app.set('port', process.env.PORT || 8080); // 서버 실행 포트 설정

// CORS 설정 (TODO: 추후 설정)
app.use(cors()); // 모든 도메인 요청 허용

app.use(morgan('dev')); // 로그 미들웨어
app.use('/', express.static(path.join(__dirname, 'public'))); // 정적 파일 제공
app.use(express.json()); // JSON 요청 본문 처리
app.use(express.urlencoded({ extended: false })); // URL 인코딩된 본문 처리
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false, // 세션이 변경된 경우에만 저장: 세션이 변경되지 않았더라도 세션을 다시 저장할지 여부를 결정 (default: true)
    saveUninitialized: false, // 초초기화되지 않은 세션을 저장하지 않음: 기화되지 않은 세션(내용이 없는 세션)을 저장할지 여부를 결정 (default: true)
    secret: process.env.COOKIE_SECRET || 'COOKIE_SECRET',
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod', // 운영 환경의 경우 HTTPS하여 true 설정되도록
    },
    name: 'session-cookie',
}));

// Router 등록
app.use('/', indexRouter);
app.use('/api/v1/beta', betaRouter);

// 404 ERROR Handler
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

// 500 ERROR Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('INTERNAL SERVER ERROR!');
});

// app.listen으로 포트를 열어 클라이언트 요청을 수신
app.listen(app.get('port'), () => {
    if (process.env.NODE_ENV === 'dev') {
        console.log(app.get('port'), 'Port Waiting...');
    }
});