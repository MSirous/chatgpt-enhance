const mysql = require('mysql2');

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Mahsa7066",
    database: "gpt_enhance"
});

db.getConnection((err, con)=>{
    if (err) {
        console.log(`Could not connect to the database ${err}`)
    }else{
        console.log("Succesfully connected to the database")
    }
});

module.exports = db;