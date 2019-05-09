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

  if (!email || !password) {
      return res.status(401).json({
          errors: {
              status: 401,
              source: "/register",
              title: "Email or password missing",
              detail: "Email or password missing in request"
          }
      });
  }

  bcrypt.hash(password, 10, function(err, hash) {
      if (err) {
          return res.status(500).json({
              errors: {
                  status: 500,
                  source: "/register",
                  title: "bcrypt error",
                  detail: "bcrypt error"
              }
          });
      }

      db.run("INSERT INTO User (email, password) VALUES (?, ?)",
          email,
          hash, (err) => {
              if (err) {
                  return res.status(500).json({
                      errors: {
                          status: 500,
                          source: "/register",
                          title: "Database error",
                          detail: err.message
                      }
                  });
              }

              res.status(201).json({
                  data: {
                      message: "User successfully registered."
                  }
              });
          });
  });
});


module.exports = router;
