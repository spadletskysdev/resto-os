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
                        res.redirect('menu')
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

const getDish = (req, res) => {
    var id = req.params.id;
    if (!id || id === undefined) {
        res.render('error', {message: 'Where is the ID?'});
    } else {
        con.query('SELECT * FROM menu WHERE id=?', [id], (err, results, fields) => {
            if (err) {
                throw err;
            } else {
                res.render('dish', { results })
                console.log(results)
            }
        })
    }
    
};

const editDish = (req, res) => {
    var { image, name, description, price } = req.body
    var id = req.params.id
    con.query('SELECT * FROM menu WHERE id=?', [id], (err, defaults, fields) => {
        if (err) {
            throw err;
        } else {
            // Filter out the data
            if (image == '' || image == undefined) {
                image = defaults[0].image
                console.log(image)
            } else if (name == '' || name == undefined) {
                name = defaults[0].dishName
                console.log(name)
            } else if (description == '' || description == undefined) {
                description = defaults[0].description
                console.log(description)
            } else if (price == '' || price == undefined) {
                price = defaults[0].price
                console.log(price)
            }
            console.log(defaults)
            console.log(image, name, description, price)
            res.render('dish', {defaults})
            con.query('UPDATE menu SET image = ?, dishName = ?, description = ?, price = ?', [image, name, description, price], (err, results, fields) => {
                if (err) {
                    throw err;
                } else {
                    res.render('dish', {results})
                }
            })
        }
    })


}



module.exports = { getMenu, getDish, addDish, editDish };