require("dotenv").config();
const express = require("express");




const cors = require("cors");
const bodyparser = require("body-parser");
const app = express();
const PORT = 5000;
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(cors());

const router = require("./src/routes");
const authRoutes = require("./src/routes/authRoutes/authRoutes");
const { Sequelize } = require("./models");

const sequlize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  }
);
app.use("/api/v1", authRoutes);

app.get("/", (req, res) => {
  res.send("");
});

app.listen(PORT, () => {
  console.log(`Server is running at Port ${PORT}`);
});
