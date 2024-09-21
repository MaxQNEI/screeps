import express from "express";

const app = express();

app.all("*", (req, res, next) => {
    console.log(req.method, req.url, req.body);
});

app.listen(8484, "localhost", () => console.log(`Listening...`));
