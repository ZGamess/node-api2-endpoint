const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "157.245.59.56",
  user: "u6403825",
  password: "6403825",
  database: "u6403825_dit322",
  port: 3366,
});

var app = express();
app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.json({
    status: "ok",
    message: "Api Start",
  });
});

app.get("/customers", function (req, res) {
  connection.query("SELECT * FROM a1_customer", 
  function (err, results) {
    console.log(results); //แสดงผลที่ console
    res.json(results); //ตอบกลับ request
  });
});

app.get("/products", function (req, res) {
  connection.query(
    `SELECT * FROM a1_products`,
    function (err, results) {
      res.json(results);
    }
  );
});

app.get("/orders", function (req, res) {
  connection.query(
    `SELECT * FROM a1_orders`,
    function (err, results) {
      res.json(results);
    }
  );
});

// เรียงลับดับจากคนที่ซื้อเยอะ => น้อยที่สุด
app.get("/top_customers", function (req, res) {
  connection.query(
    `SELECT C.CFirstname, SUM(O.QTY*P.ราคา) AS price_sum FROM a1_customer AS C INNER JOIN a1_orders AS O ON C.CID = O.CID INNER JOIN a1_products AS P ON O.PID = P.PID GROUP BY C.CID ORDER BY price_sum DESC;`,
    function (err, results) {
      res.json(results);
    }
  );
});

// เรียงลับดับจากคนที่ซื้อเยอะ => น้อยที่สุด
app.get('/top_products', function(req, res){
  connection.query(
    `SELECT O.ID, P.ชื่อสินค้า, O.QTY, O.QTY as Total_QTY FROM a1_orders as O INNER JOIN a1_products as P ON O.PID = P.PID GROUP BY O.ID, P.ชื่อสินค้า, O.QTY, P.ราคา ORDER BY Total_QTY DESC;`,
    function (err, results) {
      res.json(results);
    }
  );
});


app.post("/createusers", function (req, res) {
  const Firstname = req.body.Firstname;
  const Lastname = req.body.Lastname;
  const Email = req.body.Email;
  const Gender = req.body.Gender;
  const Tel = req.body.Tel;
  const Age = req.body.Age;
  const Address = req.body.Address;
  connection.query(
    `INSERT INTO a1_customer (Firstname, Lastname, Email, Gender, Tel, Age, Address) VALUES (?, ?, ?, ?, ? ,? ,?)`,
    [Firstname, Lastname, Email, Gender, Tel, Age, Address],
    function (err, results) {
      if (err) {
        res.json(err);
      }
      res.json(results);
    }
  );
});

app.post('/orders', function(req, res) {
  const values = req.body
  console.log(values)
  connection.query(
    'INSERT INTO a1_orders (OrderID, CID, PID, QTY) VALUES ?', [values],
    function(err, results) {
      console.log(results) //แสดงผลที่ console
      res.json(results) //ตอบกลับ request
    }
  )
})


app.listen(5000, () => {
  console.log('Server is started.')
})
