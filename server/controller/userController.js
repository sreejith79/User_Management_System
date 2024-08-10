const mysql = require('mysql');
const { param } = require('../routes/user');

const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});

// View Users
exports.view = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log("Connected as ID "+connection.threadId);
        // Use the connection
        connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
            connection.release();
            if(!err) {
                let removedUser = req.query.removed;
                res.render('home', { rows, removedUser });
            } else {
                console.log(err);
            }
            console.log('The data from user table: \n', rows);
        });
    });
}

// Find user by search
exports.find = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log("Connected as ID "+connection.threadId);
        let searchTerm = req.body.search;
        connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
            connection.release();
            if(!err) {
                res.render('home', {rows});
            } else {
                console.log(err);
            }
        });
    });
}

//Add New User
exports.form = (req, res) => {
    res.render('addUser');
}
exports.create = (req, res) => {
    const {first_name, last_name, email, phone, comments} = req.body;
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log("Connected as ID "+connection.threadId);
        let searchTerm = req.body.search;
        connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments] , (err, rows) => {
            connection.release();
            if(!err) {
                res.render('addUser', {alert: 'User Added Successfully.'});
            } else {
                console.log(err);
            }
        });
    });
} 

// Edit user
exports.edit = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log("Connected as ID "+connection.threadId);
        // Use the connection
        connection.query('SELECT * FROM user WHERE id = ?',[req.params.id] ,(err, rows) => {
            connection.release();
            if(!err) {
                res.render('edit-user', {rows});
            } else {
                console.log(err);
            }
            console.log('The data from user table: \n', rows);
        });
    });
}

// Update user
exports.update = (req, res) => {
    const {first_name, last_name, email, phone, comments} = req.body;
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log("Connected as ID "+connection.threadId);
        // Use the connection
        connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?',[first_name, last_name, email, phone, comments, req.params.id] ,(err, rows) => {
            connection.release();
            if(!err) {
                pool.getConnection((err, connection) => {
                    if(err) throw err;
                    console.log("Connected as ID "+connection.threadId);
                    // Use the connection
                    connection.query('SELECT * FROM user WHERE id = ?',[req.params.id] ,(err, rows) => {
                        connection.release();
                        if(!err) {
                            res.render('edit-user', { rows, alert: `${first_name} Has Been Updated!` });
                        } else {
                            console.log(err);
                        }
                        console.log('The data from user table: \n', rows);
                    });
                });
            } else {
                console.log(err);
            }
            console.log('The data from user table: \n', rows);
        });
    });
}

// Delete User
exports.delete = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log("Connected as ID "+connection.threadId);
        // Use the connection
        connection.query('DELETE FROM user WHERE id = ?',[req.params.id] ,(err, rows) => {
            connection.release();
            if(!err) {
                let removedUser = encodeURIComponent('User Successfully Removed.')
                res.redirect('/?removed=' + removedUser);
            } else {
                console.log(err);
            }
            console.log('The data from user table: \n', rows);
        });
    });
}

// View User Details
exports.viewall = (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log("Connected as ID "+connection.threadId);
        // Use the connection
        connection.query('SELECT * FROM user WHERE id = ?',[req.params.id] , (err, rows) => {
            connection.release();
            if(!err) {
                res.render('view-user', {rows});
            } else {
                console.log(err);
            }
            console.log('The data from user table: \n', rows);
        });
    });
}