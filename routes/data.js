var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/users.sqlite');
const jwt = require('jsonwebtoken');


router.post("/",
    (req, res, next) => checkToken(req, res, next),
    (req, res) => getData(res, req.body)
);

function getData(res, body) {
    const email = body.email;

    if (!email) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/data",
                title: "Data missing",
                detail: "Data missing"
            }
        });
    }


    db.get("SELECT * FROM User WHERE email = ?",
        email, (err, row) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/data",
                        title: "Database error",
                        detail: err.message
                    }
                });
            }

            const data = {
                user: row.email,
                funds: row.funds,
                stocks: row.stocks
            };

            res.json(data);
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
