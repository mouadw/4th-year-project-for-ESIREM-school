var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO students (name, email, password) VALUES (?,?,?)'
                db.run(insert, ["admin","admin@example.com",md5("admin123456")])
                db.run(insert, ["user","user@example.com",md5("user123456")])
                db.run(insert, ["mouad","mouad@example.com",md5("mouad2022")])
            }
        });
        db.run(`CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            label text, 
            price INTEGER, 
            studentId INTEGER
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO products (label, price, studentId) VALUES (?,?,?)'
                db.run(insert, ["Macbook",200,1])
                db.run(insert, ["Bureau",120,1])
            }
        });  
    }
});


module.exports = db