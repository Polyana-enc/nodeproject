const express = require("express");
const path = require("path");
const cors = require('cors');

const logger = require("./src/utils/logger")
const app = express();
const PORT = 3000;

// app.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname, "public")));

const usersRouter = require("./src/routes/users");
const idexRouter = require("./src/routes/index")
const cookieParser = require("cookie-parser");

const inviteController = require("./src/controllers/invite_controller");
const privateInfoController = require("./src/controllers/private_info_controller");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use("/api", inviteController);
app.use("/api", privateInfoController);

app.use("", usersRouter);
app.use("", idexRouter);

app.listen(PORT, () => {
    logger.info(`Сервер запущено на http://localhost:${PORT}`);
});