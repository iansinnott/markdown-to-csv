const fs = require("fs");
const path = require("path");
const fm = require("front-matter");

const dataToCsv = d => {
  const filename = d.name + ".csv";
  const parsed = d.files.map(x => x.parsed);

  // Aggregate all cols from every row
  const cols = Array.from(
    parsed.reduce((agg, x) => {
      Object.keys(x.attributes).forEach(k => {
        agg.add(k);
      });

      return agg;
    }, new Set())
  );

  const rows = [cols];

  parsed.forEach(({ attributes }) => {
    rows.push(
      cols.map(k => {
        const v = attributes[k];
        return Array.isArray(v)
          ? v.join(",")
          : v === undefined
          ? ""
          : v.constructor === Date
          ? v.toISOString()
          : v;
      })
    );
  });

  const csvData = rows
    .map(row => row.map(cell => (cell ? `"${cell}"` : "")).join(","))
    .join("\n");

  fs.writeFileSync(filename, csvData, { encoding: "utf8" });
};

const dataToMarkdown = d => {
  d.files
    .map(x => x.parsed)
    .forEach(({ attributes, body }) => {
      fs.writeFileSync(attributes.title + ".md", body, { encoding: "utf8" });
    });
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
  data.forEach(dataToCsv);

  const filecount = data.flatMap(x => x.files).length;

  console.log(`Handled ${filecount} files`);

  // Doing all this in the makefile now
  // [`mkdir -p ${outdir}`, `mv *.md ${outdir}`, `mv *.csv ${outdir}`].forEach(
  //   x => {
  //     console.log("Running: $ ", x);
  //     execSync(x);
  //   }
  // );
};

main();
