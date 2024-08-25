import mysql from 'mysql'

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "aronnyok db"
})

con.connect(function (err) {
    if (err) {
        console.log('connection error')
    }
    else {
        console.log('connected')
    }
})

export default con