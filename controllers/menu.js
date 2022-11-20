require("dotenv").config();

const path = require('path');
const mysql = require('mysql2');
const { readSync } = require("fs");

var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
    port: process.env.PORT
});

const addDish = (req, res, next) => {
    var { name, description, price } = req.body;
    if (!req.files || Object.keys(req.files).length === 0) {
        res.render('error', { message: "No files were selected! Please go back to Add Page." });
    } else {
        var image = req.files.image;
        var filepath = path.join(__dirname, '..', 'public', 'images', image.name);
        var clientPath = '/images/' + image.name;

        image.mv(filepath, function (err) {
            if (err) {
                res.render('error', { message: 'Error uploading image! See below for details:', error: { status: err } });
            } else {
                con.query("INSERT INTO menu (dishName, description, price, image) VALUES (?, ?, ?, ?)", [name, description, price, clientPath], (err, results, fields) => {
                    if (err) {
                        throw err;
                    } else {
                        res.redirect('admin/menu')
                    }
                })
            }
        })
    }
}

const getMenu = (req, res) => {
    con.query("SELECT * FROM menu as dishes", (err, results, fields) => {
        if (err) {
            throw err;
        } else {
            res.render("menu", { results });
        }
    })
}

const editDish = (req, res, next) => {
    var { image, name, description, price, del } = req.body
    var id = req.params.id
    con.query('SELECT * FROM menu WHERE id=?', [id], (err, defaults, fields) => {
        if (err) {
            throw err;
        } else {

            if (del == 1) {
                con.query('DELETE FROM menu WHERE id = ?', [id], (err, results, fields) => {
                    if (err) {
                        throw err;
                    } else {
                        res.redirect('/admin/menu')
                    }
                })
            } else {
                // Filter out the data
                if (image == '' || image == undefined) {
                    image = defaults[0].image
                    console.log(image)
                } if (name == '' || name == undefined) {
                    name = defaults[0].dishName
                    console.log(name)
                } if (description == '' || description == undefined) {
                    description = defaults[0].description
                    console.log(description)
                } if (price == '' || price == undefined) {
                    price = defaults[0].price
                    console.log(price)
                }
                con.query('UPDATE menu SET image = ?, dishName = ?, description = ?, price = ? WHERE id = ?', [image, name, description, price, id], (err, results, fields) => {
                    console.log('Updated the Database')
                    if (err) {
                        throw err;
                    } else {
                        res.redirect('/admin/menu')
                        console.log('Passed!')
                    }
                })
            }

            
        }
    })
}

const getDish = (req, res) => {
    console.log('Ran getdish')
    var id = req.params.id;
    if (!id || id === undefined) {
        res.render('error', {message: 'Where is the ID?'});
    } else {
        con.query('SELECT * FROM menu WHERE id=?', [id], (err, results, fields) => {
            if (err) {
                throw err;
            } else {
                res.render('dish', { results })
                console.log('Redirected to Dish')
            }
        })
    }
    
};




module.exports = { getMenu, getDish, addDish, editDish };