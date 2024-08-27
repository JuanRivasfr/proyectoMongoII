const express = require("express");
const router = require("./server/router");
const app = express();
const path = require("path");
require("dotenv").config()

app.use(express.json())
app.use('/css', express.static(path.join(__dirname, process.env.EXPRESS_STATIC, 'css')));
app.use('/js', express.static(path.join(__dirname, process.env.EXPRESS_STATIC, 'js')));
app.use("/storage", express.static(path.join(__dirname, process.env.EXPRESS_STATIC, "storage")));

app.get("/", (req, res) =>{
    res.sendFile(`${process.env.EXPRESS_STATIC}/index.html`, {root: __dirname})
})

app.get("/servicio", (req, res) =>{
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/servicio.html`, {root: __dirname})
})

app.get("/prueba", (req, res) =>{
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/prueba.html`, {root: __dirname})
})

app.use((req, res, next) => {
    req.__dirname = __dirname;
    next();
}, router);

app.use((req, res) => {
    res.status(404).json({message: "No tiene autorizacion"})
})

let config = {
    port: process.env.EXPRESS_PORT,
    host: process.env.EXPRESS_HOST
}

app.listen(config, ()=>{
    console.log(`http://${config.host}:${config.port}`);
});