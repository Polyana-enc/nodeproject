const express = require("express");
const path = require("path");
const cors = require('cors');

const logger = require("./src/utils/logger")
const app = express();
const PORT = 3000;
// app.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname, "public")));

const usersRouter = require("./src/routes/users");
const formsRouter = require("./src/routes/forms")
const idexRouter = require("./src/routes/index")
const cookieParser = require("cookie-parser");
const { deserialize_all_forms } = require("./src/repository/form_repository");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use("", usersRouter);
app.use("", idexRouter);
app.use("", formsRouter);

function init() {
    deserialize_all_forms();
    //deserialize_all_users 
}
init()
app.listen(PORT, () => {
    logger.info(`Сервер запущено на http://localhost:${PORT}`);
});