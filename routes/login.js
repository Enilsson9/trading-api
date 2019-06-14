var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/users.sqlite');
const jwtSecret = process.env.JWT_SECRET;


router.post('/', function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  res.header("Access-Control-Allow-Origin", "*");

  if (!email || !password) {
      return res.status(401).json({
          errors: {
              status: 401,
              source: "/login",
              title: "Email or password missing",
              detail: "Email or password missing in request"
          }
      });
  }

  db.get("SELECT * FROM User WHERE email = ?",
      email,
      (err, rows) => {
          if (err) {
              return res.status(500).json({
                  errors: {
                      status: 500,
                      source: "/login",
                      title: "Database error",
                      detail: err.message
                  }
              });
          }

          if (rows === undefined) {
              return res.status(401).json({
                  errors: {
                      status: 401,
                      source: "/login",
                      title: "User not found",
                      detail: "User with provided email not found."
                  }
              });
          }

          const user = rows;

          bcrypt.compare(password, user.password, (err, result) => {
              if (err) {
                  return res.status(500).json({
                      errors: {
                          status: 500,
                          source: "/login",
                          title: "bcrypt error",
                          detail: "bcrypt error"
                      }
                  });
              }

              if (result) {
                  let payload = { email: user.email };
                  let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

                  return res.json({
                      data: {
                          type: "success",
                          message: "User logged in",
                          user: payload,
                          token: jwtToken
                      }
                  });
              } else {
                  return res.status(401).json({
                      errors: {
                          status: 401,
                          source: "/login",
                          title: "Wrong password",
                          detail: "Password is incorrect."
                      }
                  });
              }
          });
      });
});


module.exports = router;
