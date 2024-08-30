import express from 'express';
import con from '../utils/db.js'; // Ensure path is correct
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

const adminrouter = express.Router();

// Route to delete a university

adminrouter.delete('/delete_university/:universityId', (req, res) => {
    const universityId = req.params.universityId;
    const sqlDeleteDisciplines = 'DELETE FROM disciplines WHERE university_id = ?';
    const sqlDeleteUniversity = 'DELETE FROM university WHERE id = ?';

    con.query(sqlDeleteDisciplines, [universityId], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: "Error deleting disciplines" });
        }

        con.query(sqlDeleteUniversity, [universityId], (err, result) => {
            if (err) {
                return res.json({ Status: false, Error: "Error deleting university" });
            }

            return res.json({ Status: true });
        });
    });
});

// Route to delete a discipline
adminrouter.delete('/delete_discipline/:disciplineId', (req, res) => {
    const disciplineId = req.params.disciplineId;
    const sqlDeleteDiscipline = 'DELETE FROM disciplines WHERE id = ?';

    con.query(sqlDeleteDiscipline, [disciplineId], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: "Error deleting discipline" });
        }

        return res.json({ Status: true });
    });
});

// Route for boss login
adminrouter.post('/bosslogin', (req, res) => {
    console.log('Request Body:', req.body);
    const sql = 'SELECT * FROM admin WHERE email=? AND password=SHA1(?)';
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

// Route for getting categories
adminrouter.get('/category', (req, res) => {
    const sql = 'SELECT * FROM category';
    con.query(sql, (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true, Result: result });
    });
});

// Route for adding a category
adminrouter.post('/add_category', (req, res) => {
    const sql = 'INSERT INTO category (name) VALUES (?)';
    con.query(sql, [req.body.category], (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true });
    });
});

// Route for getting universities
adminrouter.get('/university', (req, res) => {
    const sql = 'SELECT * FROM university';
    con.query(sql, (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true, Result: result });
    });
});

// Route for adding a university
adminrouter.post('/add_university', (req, res) => {
    const sql = 'INSERT INTO university (name) VALUES (?)';
    con.query(sql, [req.body.name], (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true });
    });
});

// Route for getting disciplines of a university
adminrouter.get('/disciplines/:universityId', (req, res) => {
    const universityId = req.params.universityId;
    const sql = 'SELECT * FROM disciplines WHERE university_id = ?';
    con.query(sql, [universityId], (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true, Result: result });
    });
});

// Route for adding a discipline
adminrouter.post('/add_discipline', (req, res) => {
    const { university_id, name } = req.body;
    const sql = 'INSERT INTO disciplines (university_id, name) VALUES (?, ?)';
    con.query(sql, [university_id, name], (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true });
    });
});

adminrouter.delete('/delete_category/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    const sql = 'DELETE FROM category WHERE id = ?';

    con.query(sql, [categoryId], (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        if (result.affectedRows > 0) {
            return res.json({ Status: true });
        } else {
            return res.json({ Status: false, Error: "Category not found" });
        }
    });
});

adminrouter.get('/disciplines', (req, res) => {
    const sql = 'SELECT * FROM disciplines';
    con.query(sql, (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true, Result: result });
    });
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + "_" + Date.now() + path.extname(file.originalname));
    }
})

// Route for adding an employee
// const fs = require('fs');

adminrouter.post('/add_employee', (req, res) => {
    const {
        firstName, middleName, lastName, address, university, discipline, password,
        telephone, email, emergencyContact, department, salary
    } = req.body.employee;

    console.log(req.body.employee)
    const sql = `
        INSERT INTO Employees 
        (firstName, middleName, lastName, address, universityId, disciplineId, password, 
         telephone, email, emergencyContact, departmentId, salary)
        VALUES (?, ?, ?, ?, ?, ?, SHA1(?), ?, ?, ?, ?, ?)
    `;

    con.query(sql, [
        firstName, middleName || null, lastName, address, university, discipline,
        password, telephone, email, emergencyContact, department, salary
    ], (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true, Result: result });
    });
});

adminrouter.get('/employee', (req, res) => {
    const sql = `
        SELECT e.id, e.firstName, e.middleName, e.lastName, e.address, u.name AS universityName, d.name AS disciplineName , e.telephone, e.email, e.emergencyContact, e.departmentId, e.salary FROM Employees e
        JOIN University u ON e.universityId = u.id
        JOIN Disciplines d ON e.disciplineId = d.id  `;
    con.query(sql, (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        res.json(result);
    });
});
adminrouter.get('/tasks/:employeeId', (req, res) => {
    const { employeeId } = req.params;

    const sql = `SELECT t.id, t.description, t.deadline FROM Tasks  t WHERE t.employeeId = ?`;
    con.query(sql, [employeeId], (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        res.json(result);
    });
});
adminrouter.delete('/employee/:id', (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM Employees WHERE id = ?
    `;
    con.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        res.json({ Status: true, Result: result });
    });
});
adminrouter.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;

    const sql = `
        DELETE FROM Tasks WHERE id = ?
    `;
    con.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        res.json({ Status: true, Result: result });
    });
});

adminrouter.post('/tasks', (req, res) => {
    const { employeeId, description, deadline } = req.body;

    const sqlInsertTask = `
        INSERT INTO Tasks (employeeId, description, deadline)
        VALUES (?, ?, ?)
    `;

    con.query(sqlInsertTask, [employeeId, description, deadline], (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }

        return res.json({ Status: true, TaskId: result.insertId });
    });
});
// Route for editing a task
adminrouter.put('/tasks/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const { description, deadline } = req.body;

    const sqlUpdateTask = `
        UPDATE Tasks 
        SET description = ?, deadline = ?
        WHERE id = ?
    `;

    con.query(sqlUpdateTask, [description, deadline, taskId], (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }

        if (result.affectedRows > 0) {
            return res.json({ Status: true });
        } else {
            return res.json({ Status: false, Error: "Task not found" });
        }
    });
});

// PUT route for updating an employee
adminrouter.get('/employee/:id', (req, res) => {
    console.log("Route accessed")
    const id = req.params.id;
    console.log(req.params)
    const sql = 'SELECT * FROM  EMPLOYEES WHERE id=?'
    console.log(id)
    con.query(sql, id, (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.json({ Status: false, Error: "Query Error" });
        }
        return res.json({ Status: true, Employee: result });

    })
})


const upload = multer(); // Assuming file uploads are handled by multer

adminrouter.put('/employee/:id', upload.any(), (req, res) => {
    console.log(req.params); // Should log the params correctly
    console.log(req.body);   // Log the body to check its structure

    const { id } = req.params;

    // Adjust destructuring based on your form structure
    const {
        firstName, lastName, telephone, discipline, university, email, address, department, salary
    } = req.body; // Adjust this based on what you see in req.body

    const sql = `
        UPDATE Employees 
        SET firstName = ?, lastName = ?, telephone = ?, disciplineId = ?, universityId = ?, 
            email = ?, address = ?, departmentId = ?, salary = ?
        WHERE id = ?
    `;

    con.query(sql, [
        firstName, lastName, telephone, discipline, university, email, address, department, salary, id
    ], (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.status(500).json({ Status: false, Error: "Query Error" });
        }

        // Send updated employee data back
        const updatedEmployee = {
            id,
            firstName,
            lastName,
            telephone,
            discipline,
            university,
            email,
            address,
            department,
            salary
        };

        return res.json({ Status: true, Employee: updatedEmployee });
    });
});
adminrouter.get('/employee-count', (req, res) => {
    const sql = 'SELECT COUNT(*) AS totalEmployees FROM Employees';
    con.query(sql, (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.status(500).json({ Status: false, Error: 'Query Error' });
        }
        return res.json({ Status: true, TotalEmployees: result[0].totalEmployees });
    });
});
adminrouter.get('/employee-count-by-category', (req, res) => {
    const sql = `
        SELECT d.name AS department, COUNT(e.id) AS totalEmployees
        FROM Employees e
        JOIN category d ON e.departmentId = d.id
        GROUP BY d.name
    `;
    con.query(sql, (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.status(500).json({ Status: false, Error: 'Query Error' });
        }
        return res.json({ Status: true, EmployeeCountByCategory: result });
    });
});
adminrouter.get('/employee-count-by-university', (req, res) => {
    const sql = `
        SELECT u.name AS university, COUNT(e.id) AS totalEmployees
        FROM Employees e
        JOIN University u ON e.universityId = u.Id
        GROUP BY u.name
    `;
    con.query(sql, (err, result) => {
        if (err) {
            console.error('Query Error:', err);
            return res.status(500).json({ Status: false, Error: 'Query Error' });
        }
        return res.json({ Status: true, EmployeeCountByUniversity: result });
    });
});




export { adminrouter };
