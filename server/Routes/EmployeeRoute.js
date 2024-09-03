import express from 'express'
import con from '../utils/db.js'; // Ensure path is correct
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';




const employeerouter = express.Router()

employeerouter.post('/employeelogin', (req, res) => {
    console.log('Request Body:', req.body);
    const sql = 'SELECT * FROM employees WHERE email=? AND password=SHA1(?)';
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ loginStatus: false, Error: "Query Error" });
        }
        if (result.length > 0) {
            const token = jwt.sign({ role: "admin" }, "jwt_secret_key", { expiresIn: '1d' });
            res.cookie('token', token);
            return res.json({ loginStatus: true });
        } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    });
});

export { employeerouter }