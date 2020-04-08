const fs = require("fs");
const path = require("path");
const fm = require("front-matter");
const tap = require("ramda/src/tap");

const dataToCsv = d => {};

const dataToMarkdown = d => {
  return d.files
    .map(x => x.parsed)
    .map(
      tap(({ attributes, body }) => {
        fs.writeFileSync(attributes.title + ".md", body, { encoding: "utf8" });
      })
    );
};

const main = () => {
  const args = process.argv.slice(2);
  const data = args
    .map(x => path.resolve(x))
    .map(x => {
      return {
        dirpath: x,
        name: path.basename(x),
        files: fs.readdirSync(x).map(y => path.resolve(x, y))
      };
    })
    .map(x => {
      return {
        ...x,
        files: x.files.map(filepath => {
          const raw = fs.readFileSync(filepath, { encoding: "utf8" });
          return {
            filepath,
            ext: path.extname(filepath),
            raw,
            parsed: fm(raw)
          };
        })
      };
    });

  data.forEach(dataToMarkdown);

  console.log(JSON.stringify(dirs[1]));
};

main();
