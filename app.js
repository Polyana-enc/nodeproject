const express = require("express");
const path = require("path");
const cors = require("cors");

const logger = require("./src/utils/logger");
const app = express();
const PORT = 3000;

const indexRouter = require("./src/routes/index");
const indexRouter = require("./src/routes/index");
const usersRouter = require("./src/routes/users");
const formsRouter = require("./src/routes/forms");
const invitesRouter = require("./src/routes/invites")
const pagesRouter = require("./src/routes/pages");

const cookieParser = require("cookie-parser");

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
app.use("/api", usersRouter);
app.use("/api", indexRouter);
app.use("/api", formsRouter);
app.use("/api", invitesRouter);

async function init() {
}
init();
app.listen(PORT, () => {
  logger.info(`Сервер запущено на http://localhost:${PORT}`);
});
