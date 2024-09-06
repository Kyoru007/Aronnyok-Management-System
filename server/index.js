import express from "express";
import cors from 'cors'
import { adminrouter } from "./Routes/AdminRoute.js";
import { employeerouter } from "./Routes/EmployeeRoute.js";



const app = express()
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(express.json())
app.use('/auth', adminrouter)
app.use('/employee', employeerouter)
app.use(express.static('Public'))


app.listen(3000, () => {
    console.log("server is running")
})

