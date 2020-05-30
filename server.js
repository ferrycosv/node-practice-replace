const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const util = require("util");
const replace = require("./logic");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);
const readDirPromise = util.promisify(fs.readdir);

// GET: '/files'
// response: {status: 'ok', files: ['all.txt','file.txt','names.txt']}

app.get("/files", async (req, res, next) => {
  try {
    const dirFiles = await readDirPromise(path.join(__dirname, "files"), {
      withFileTypes: true,
    });
    res.json({ status: "ok", files: dirFiles.map((x) => x.name) });
  } catch (err) {
    res.json({ status: "error", ...err });
  }
});

// POST: '/files/add/:name'
//  body: {text: "file contents"}
//  write a new files into ./files with the given name and contents
// redirect -> GET: '/files'

app.post("/files/add/:name", async (req, res, next) => {
  try {
    await writeFilePromise(
      path.join(__dirname, "files", req.params.name + ".txt"),
      req.body.text,
      "utf8"
    );
    res.redirect("/files");
  } catch (err) {
    res.json({ status: "error", ...err });
  }
});

// PUT: '/files/replace/:oldFile/:newFile'
//  body: {toReplace: "str to replace", withThis: "replacement string"}
//  route logic:
//    read the old file
//    use the replace function to create the new text
//    write the new text to the new file name
//  note - params should not include .txt, you should add that in the route logic
// failure: {status: '404', message: `no file named ${oldFile}`  }
// success: redirect -> GET: '/files'

app.put("/files/replace/:oldFile/:newFile", async (req, res, next) => {
  try {
    const text = await readFilePromise(
      path.join(__dirname, "files", req.params.oldFile + ".txt"),
      "utf-8"
    );
    await writeFilePromise(
      path.join(__dirname, "files", req.params.newFile + ".txt"),
      replace(text, req.body.toReplace, req.body.withThis),
      "utf8"
    );
    res.redirect("/files");
  } catch (err) {
    res.json({ status: "404", message: `no file named ${oldFile}` });
  }
});

// GET: '/report'
//  reads the contents from ./test/report.json and sends it
// response: {status: 'ok', report }

app.get("/report", async (req, res, next) => {
  try {
    const text = await readFilePromise(
      path.join(__dirname, "test", "report.json"),
      "utf-8"
    );
    const report = JSON.parse(text);
    res.json({ status: "ok", ...report });
  } catch (err) {
    res.json({ status: "error", ...err });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Replacer is serving at http://localhost:${port}`)
);
