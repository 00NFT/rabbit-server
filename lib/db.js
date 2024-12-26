// Database 설정
const dotenv = require('dotenv');
const mysql = require('mysql');

// 환경변수 설정
const env = process.env.NODE_ENV || 'dev';
dotenv.config({ path: `.env.${env}` });

// Connection Pool 생성
const pool = mysql.createPool({
    connectionLimit: 10, // 최대 Connection Pool 개수
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

/**
 * Query 실행 함수
 * @param {*} sql : 실행할 SQL문
 * @param {*} params : SQL 전달 파라미터
 * @returns 쿼리 실행 결과
 */
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (error, results) => {
            if (error) {
                return reject(error); // 실패 처리 .catch() 호출
            }
            resolve(results); // 성공 처리 .then() 호출
        });
    });
};

module.exports = { query };