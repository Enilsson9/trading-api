var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/users.sqlite');
const jwt = require('jsonwebtoken');


router.post("/",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => update(res, req.body)
);

function update(res, body) {
    const email = body.email;
    const stocks = body.stocks;
    const price = body.price;

    if (!email || !stocks || !price) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/update",
                title: "Data missing",
                detail: "Data missing"
            }
        });
    }


    db.run("UPDATE User SET stocks = ?, funds = ? WHERE email = ?",
        stocks,
        price,
        email, (err) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/update",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            res.status(201).json({
                data: {
                    message: "User updated successfully."
                }
            });
        });
}



function checkToken(req, res, next) {
    const token = req.headers['x-access-token'];

    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    title: "Token not valid",
                    detail: err.message
                }
            });
        }

        // Valid token send on the request
        next();
    });
}


module.exports = router;
