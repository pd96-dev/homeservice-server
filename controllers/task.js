const pool = require("../db");

const getAllTasks = (req, res) => {
    const id = req.params.id;
    pool
      .query("SELECT * FROM task WHERE propertyid=$1 ;", [id])
      .then((data) => {
        console.log(data);
        res.json(data.rows);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
};

const getTaskById = (req, res) => {
    const id = req.params.id;
    pool
      .query("SELECT * FROM task WHERE propertyid=$1;", [id])
      .then((data) => {
        //   console.log(data);
        if (data.rowCount === 0) {
          res.status(404).json({ message: "Task not found" });
        }
        res.json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
};

const createTask = (req, res) => {
    const id = req.params.id;
    const { title , description , status, date, propertyid } =
      req.body; // form data from body
    pool
      .query(
        "INSERT INTO task (title, description, status, date, propertyid) VALUES ($1,$2,$3,$4,$5) RETURNING *;",
        [ title, description, status, date, propertyid]
      )
      .then((data) => {
        console.log(data);
        res.status(201).json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
  };

const updateTask = (req, res) => {
    const id = req.params.id;
    const {title, description, status, date, propertyid} =
      req.body; // form data from body
    pool
      .query(
        "UPDATE task SET title=$1, description=$2, status=$3, date=$4  WHERE propertyid=$5 RETURNING *;",
        [title , description , status, date, propertyid]
      )
      .then((data) => {
        console.log(data);
        res.status(201).json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
  };


const deleteTask = (req, res) => {
    const id = Number(req.params.id);
    pool
      .query("DELETE FROM task WHERE propertyid=$1 RETURNING *;", [id])
      .then((data) => {
        console.log(data);
        res.json(data.rows[0]);
      })
      .catch((e) => res.status(500).json({ message: e.message }));
  };

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
};