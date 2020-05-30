const replace = require("./logic/index.js");
const fs = require(`fs`);
const path = require(`path`);
const util = require("util");

const HELP = `
command line arguments:
1: the file you want to read from
2: the old string to replace
3: the new string to replace it with
4: the file you want to write to

examples:
$ node cli.js the-book-of-sand.txt the any sand-the-any.txt
$ node cli.js the-library-of-babel.txt f g library-f-g.txt
`;

const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);
const readDirPromise = util.promisify(fs.readdir);

const main = async () => {
  try {
    if (process.argv.includes("-list")) {
      const dirFiles = await readDirPromise(path.join(__dirname, "files"), {
        withFileTypes: true,
      });
      console.log(
        dirFiles.reduce((ans, curr, idx, arr) => {
          return (ans += `${curr.name}\n`);
        }, "\nList of files:\n\n")
      );
      process.exit(0);
    }

    if (process.argv.length < 6 || process.argv.includes("-help")) {
      console.log(HELP);
      process.exit(0);
    }

    const fileName1 = process.argv[2];
    const toReplace = process.argv[3];
    const withThis = process.argv[4];
    const fileName2 = process.argv[5];

    const text = await readFilePromise(
      path.join(__dirname, "files", fileName1),
      "utf-8"
    );
    await writeFilePromise(
      path.join(__dirname, "files", fileName2),
      replace(text, toReplace, withThis),
      "utf-8"
    );
    console.log("New file created successfully, program terminated...");
  } catch (err) {
    console.log(err);
  }
};
main();
/* write a CLI interface for the "replace" function and your files

  command line arguments:
    1: the file you want to read from
    2: the old string to replace
    3: the new string to replace it with
    4: the file you want to write to

  examples:
  $ node cli.js the-book-of-sand.txt the any sand-the-any.txt
  $ node cli.js the-library-of-babel.txt f g library-f-g.txt

  behavior:
  : parse command line arguments from process.argv
    (let the user know if they are missing any arguments!)
  : read from the selected file in the './files' directory
  : use your logic function to create the new text
  : write to the new file
  : console.log a nice message letting the user know what happened

  little challenges:
  : -help
    if a user passes in "-help" as any command line argument,
    log a little description of how the CLI works
  : -list
    if a user passes in "-list" as any command line argument,
    log a list of all the file names in "./files"

*/
