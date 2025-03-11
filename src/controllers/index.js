function healthcheck(req, res, next) {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
}

module.exports = {healthcheck}