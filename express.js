import express from "express";

const app = express();

app.all("*", (req, res, next) => {
    console.log(req.url);
});

app.listen(8484, "localhost", () => console.log(`Listening...`));
