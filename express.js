import express from "express";

const app = express();

app.all("*", (req, res, next) => {
    if (
        req.method === "OPTIONS" &&
        req.headers.origin.indexOf("https://screeps.com") === 0
    ) {
        res.set({
            "Access-Control-Allow-Origin": "https://screeps.com",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*",
        });

        res.send();
    }
});

app.post("/msg", (req, res, next) => {
    console.log(req.method, req.url, req.body);
    res.send({ ok: true });
});

app.listen(8484, "localhost", () => console.log(`Listening...`));
