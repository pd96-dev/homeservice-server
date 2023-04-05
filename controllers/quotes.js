const pool = require("../db");

const getAllQuotes = (req, res) => {
  const id = req.params.id;
  pool
    .query("SELECT quoteid, quotes.description AS quotedescription, duedate, price, approval, serviceproviderid, title, task.description AS taskdescription, status, date, categoryid, image, address, city, state, country, zipcode, property.propertyid, users.firstname, users.lastname, users.email, users.phone FROM quotes INNER JOIN task ON task.taskid = quotes.taskid INNER JOIN property ON task.propertyid = property.propertyid INNER JOIN users ON users.userid = property.userid WHERE serviceproviderid=$1;", [id])
    .then((data) => {
      console.log(data);
      res.json(data.rows);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const getQuoteById = (req, res) => {
  const id = req.params.id;
  pool
    .query("SELECT * FROM quotes WHERE quoteid=$1;", [id])
    .then((data) => {
      //   console.log(data);
      if (data.rowCount === 0) {
        res.status(404).json({ message: "quotes not found" });
      }
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const createQuote = (req, res) => {
  const { description, duedate, price, approval, taskid, serviceproviderid } =
    req.body; // form data from body
  pool
    .query(
      "INSERT INTO quotes (description, duedate, price, approval, taskid, serviceproviderid) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;",
      [description, duedate, price, approval, taskid, serviceproviderid]
    )
    .then((data) => {
      console.log(data);
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const updateQuote = (req, res) => {
  const id = req.params.id;
  const { description, duedate, price, taskid, approval, serviceproviderid } =
    req.body; // form data from body
  pool
    .query(
      "UPDATE quotes SET description=$1, duedate=$2, price=$3,approval=$4, taskid=$5,serviceproviderid=$6 WHERE quoteid=$7 RETURNING *;",
      [description, duedate, price, approval, taskid, serviceproviderid, id]
    )
    .then((data) => {
      console.log(data);
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const deleteQuote = (req, res) => {
  const id = Number(req.params.id);
  pool
    .query("DELETE FROM quotes WHERE quoteid=$1 RETURNING *;", [id])
    .then((data) => {
      console.log(data);
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

module.exports = {
  getAllQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
};
