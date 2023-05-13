const express = require("express");
const route = require("../src/routes/route");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://ShailabhSrivastava:LtR74yQBXKkSdvyd@cluster0.cxb6bki.mongodb.net/simpleAssignment",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.all("/*", function (req, res) {
  res.status(404).send({ status: false, message: "Incorrect URL" });
});

app.listen(3000, function () {
  console.log("Express app running on port " + (3000));  
});
