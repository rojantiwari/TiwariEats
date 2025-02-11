import express from "express"
import path from "path";

const app = express()

const PORT = process.env.PORT || 3000;
const DIRNAME = path.resolve();

app.get("/", (req, res) => {
    res.send("working")
})


app.listen(3000, () => { console.log('App working') })