const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'HJndezo78ZDBJ',
    database: 'library'
})

db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('Database Connected !')
})

module.exports = db
