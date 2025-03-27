const express = require("express");
const path = require("path");
const cors = require("cors");

const logger = require("./src/utils/logger");
const app = express();
const PORT = 3000;

const usersRouter = require("./src/routes/users");
const formsRouter = require("./src/routes/forms");
const idexRouter = require("./src/routes/index");
const pagesRouter = require("./src/routes/pages");

const cookieParser = require("cookie-parser");
const { deserialize_all_forms } = require("./src/repository/form_repository");
const { deserialize_all_users } = require("./src/repository/user_repository");

app.engine(".ejs", require("ejs").__express);
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "src/public")));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use("", pagesRouter);
app.use("", usersRouter);
app.use("", idexRouter);
app.use("", formsRouter);

function init() {
  deserialize_all_forms();
  deserialize_all_users();
}
init();
app.listen(PORT, () => {
  logger.info(`Сервер запущено на http://localhost:${PORT}`);
});
