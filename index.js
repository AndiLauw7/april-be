require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));

const router = require("./src/routes");
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("");
});

app.listen(PORT, () => {
  console.log(`Server is running at Port ${PORT}`);
});
