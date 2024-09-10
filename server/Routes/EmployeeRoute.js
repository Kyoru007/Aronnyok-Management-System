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
            const token = jwt.sign({ role: "employee" }, "jwt_not_secret_key", { expiresIn: '1d' });
            res.cookie('token', token);
            console.log(result)
            return res.json({ loginStatus: true, id: result[0].id });
        } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    });
});

employeerouter.get('/detail/:id', (req, res) => {
    const id = req.params.id;

    // Query to get the employee details
    const employeeQuery = `
        SELECT e.*, d.name as disciplineName, u.name as universityName
        FROM employees e
        JOIN disciplines d ON e.disciplineId = d.id
        JOIN university u ON e.universityId = u.Id
        WHERE e.id = ?
    `;

    // Query to get the tasks for the employee
    const taskQuery = "SELECT * FROM tasks WHERE employeeId = ?";

    // First, we run the employee query
    con.query(employeeQuery, [id], (err, employeeResult) => {
        if (err) {
            return res.json({ Status: false, Message: "Error fetching employee details", Error: err });
        }

        if (employeeResult.length === 0) {
            return res.json({ Status: false, Message: "Employee not found" });
        }

        const employee = employeeResult[0]; // Assuming only one employee will be returned
        console.log(employee)
        // Now, we run the task query to fetch tasks associated with this employee
        con.query(taskQuery, [id], (err, taskResult) => {
            console.log("Tasks:", taskResult)
            if (err) {
                return res.json({ Status: false, Message: "Error fetching tasks", Error: err });
            }

            // Respond with both employee details and tasks
            return res.json({
                Status: true,
                employee: employee,
                tasks: taskResult // Task list
            });
        });
    });
});

employeerouter.post('/logout', (req, res) => {
    // Clear the token cookie
    res.clearCookie('token');  // Assuming your token is stored in a cookie called 'token'
    return res.json({ message: 'Logout successful', success: true });
});


export { employeerouter }