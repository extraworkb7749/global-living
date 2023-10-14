const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const server = express();
const usersRoutes = require("./routes/users.routes");
const customerInfoRoutes = require("./routes/customerInfo.routes");
const documentRoutes = require("./routes/documents.routes");
const categoryRoutes = require("./routes/category.routes");
const detailCategoryRoutes = require("./routes/detailCategory.routes");
const newsRoutes = require("./routes/news.routes");
const newsDetailRoutes = require("./routes/newsDetail.routes");
const homepageRoutes = require("./routes/homepage.routes");
const faqCategoryRoutes = require("./routes/faqCategory.routes");
const faqQuestionsRoutes = require("./routes/faqQuestion.routes");
const commonDataRoutes = require("./routes/common_data.routes");

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());
server.use(morgan("dev"));

server.use("/api/v1/users", usersRoutes);
server.use("/api/v1/customerinfo", customerInfoRoutes);
server.use("/api/v1/documents", documentRoutes);
server.use("/api/v1/category", categoryRoutes);
server.use("/api/v1/detailcategory", detailCategoryRoutes);
server.use("/api/v1/news", newsRoutes);
server.use("/api/v1/newsdetail", newsDetailRoutes);
server.use("/api/v1/homepage", homepageRoutes);
server.use("/api/v1/faqcategory", faqCategoryRoutes);
server.use("/api/v1/faqquestion", faqQuestionsRoutes);
server.use("/api/v1/common-data", commonDataRoutes);
server.get("/", (req, res) => {
  res.send("Hello world");
});

server.listen(8000, () => {
  console.log("server is running on http://localhost:8000");
});
