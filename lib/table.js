export default function table(rows = []) {
  const colsWidth = [];

  // detect
  for (const row of rows) {
    for (let ci = 0; ci < row.length; ci++) {
      colsWidth[ci] = Math.max(colsWidth[ci] || 0, `${row[ci] ?? ""}`.length);
    }
  }

  // pad
  for (let ci = 0; ci < colsWidth.length; ci++) {
    for (const row of rows) {
      row[ci] = `${row[ci] ?? ""}`.padEnd(colsWidth[ci], " ");
    }
  }

  // log
  const fulllen = colsWidth.reduce((pv, cv) => pv + cv, 0) + (colsWidth.length * 4 - 1);
  const out = [];

  out.push("".padEnd(fulllen, "_"));

  for (const row of rows) {
    out.push(`| ${row.join(" | ")} |`);
  }

  out.push("".padEnd(fulllen, "‾"));

  console.log(out.join("\n"));
}
