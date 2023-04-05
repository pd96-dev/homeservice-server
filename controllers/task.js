const cloudinary = require("cloudinary").v2;
const pool = require("../db");
const path = require("path");
const fs = require("fs");
const { Console } = require("console");

const getAllTasksProperty = (req, res) => {
  const id = req.params.id;
  pool
    .query(
      "SELECT * FROM task INNER JOIN categories ON task.categoryid = categories.categoryid WHERE propertyid=$1 ;",
      [id]
    )
    .then((data) => {
      console.log(data);
      res.json(data.rows);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const getAllTasks = (req, res) => {
  pool
    .query(
      "SELECT *,(SELECT COUNT(*) FROM quotes WHERE quotes.taskid = task.taskid) AS quote_count FROM task INNER JOIN categories ON task.categoryid = categories.categoryid;"
    )
    .then((data) => {
      console.log(data);
      res.json(data.rows);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const getTaskByCategoryId = (req, res) => {
  const id = req.params.id;
  pool
    .query(
      "SELECT *, task.description, property.description AS propertydescription, (SELECT COUNT(*) FROM quotes WHERE quotes.taskid = task.taskid) AS quote_count FROM task  INNER JOIN categories ON task.categoryid = categories.categoryid INNER JOIN property ON task.propertyid = property.propertyid WHERE task.categoryid = $1;",
      [id]
    )
    .then((data) => {
      console.log(data);
      res.json(data.rows);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const getTaskById = (req, res) => {
  const id = req.params.id;
  pool
    .query(
      "SELECT *, task.description, property.description AS propertydescription, (SELECT COUNT(*) FROM quotes WHERE quotes.taskid = task.taskid) AS quote_count FROM task INNER JOIN categories ON task.categoryid = categories.categoryid INNER JOIN property ON task.propertyid = property.propertyid WHERE task.taskid =$1;",
      [id]
    )
    .then((data) => {
      //   console.log(data);
      if (data.rowCount === 0) {
        res.status(404).json({ message: "Task not found" });
      }
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

const createTask = async (req, res) => {
  console.log(req);
  console.log("****");
  console.log(req.file);
  console.log("****");

  const { buffer, originalname } = req.file;
  const {
    title,
    description,
    status,
    date,
    propertyid,
    imagedescription,
    categoryid,
  } = req.body; // form data from body

  // Upload image to Cloudinary and get secure_url
  // Convert the buffer to a file path string
  const filePath = path.join(__dirname, "/../uploads", originalname);
  fs.writeFileSync(filePath, buffer);

  // Upload the file to Cloudinary
  const result = await cloudinary.uploader.upload(filePath, {
    public_id: originalname,
  });

  // Delete the local file after uploading to Cloudinary
  fs.unlinkSync(filePath);

  // get secure_url to be stored in postgraysql database
  const image = result.secure_url;
  console.log(image);
  console.log(
    "INSERT INTO task ( title,description,status,date,propertyid,image,imagedescription, categoryid) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;",
    [
      title,
      description,
      status,
      date,
      propertyid,
      image,
      imagedescription,
      categoryid,
    ]
  );
  pool
    .query(
      "INSERT INTO task ( title,description,status,date,propertyid,image,imagedescription, categoryid) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;",
      [
        title,
        description,
        status,
        date,
        propertyid,
        image,
        imagedescription,
        categoryid,
      ]
    )
    .then((data) => {
      console.log(data);
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};


const updateTask = async (req, res) => {
  const taskid = req.params.id;
  let {
    title,
    description,
    status,
    date,
    propertyid,
    image,
    imagedescription,
    categoryid,
  } = req.body; // form data from body

  console.log(`Data from client: Title:${title},
     ${description},
     ${status},
     ${date},
     ${propertyid},
     ${image},
     ${imagedescription},
     ${categoryid}`);
  // check if the file is present in req --> upload file to cloudinary and update image with the cloudinary image url
  if (req.file) {
    const { buffer, originalname } = req.file;

    // Upload image to Cloudinary and get secure_url
    // Convert the buffer to a file path string
    const filePath = path.join(__dirname, "/../uploads", originalname);
    fs.writeFileSync(filePath, buffer);

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: originalname,
    });

    // Delete the local file after uploading to Cloudinary
    fs.unlinkSync(filePath);

    // get secure_url to be stored in postgraysql database
    image = result.secure_url;
  }

  pool
    .query(
      "UPDATE task SET title=$1, description=$2, status=$3, date=$4 ,image=$5, imagedescription=$6, categoryid=$7, propertyid=$8 WHERE taskid=$9 RETURNING *;",
      [
        title,
        description,
        status,
        date,
        image,
        imagedescription,
        categoryid,
        propertyid,
        taskid,
      ]
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
    .query("DELETE FROM task WHERE taskid=$1 RETURNING *;", [id])
    .then((data) => {
      console.log(data);
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
};

module.exports = {
  getTaskByCategoryId,
  getAllTasksProperty,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
