export default function dump() {
  const out = [];

  out.push("Dump {");

  for (const arg of arguments) {
    _(arg, 1);
  }

  function _(arg, tab = 0, key = null) {
    const spaces = "".padStart(tab * 2, " ");

    key = key ? `"${key}": ` : "";

    const prefix = `${spaces}${key}`;

    if (arg === null) {
      out.push(`${prefix}NULL`);
    } else if (arg === undefined) {
      out.push(`${prefix}UNDEFINED`);
    } else if (typeof arg === "boolean") {
      out.push(`${prefix}${arg ? "TRUE" : "FALSE"}`);
    } else if (typeof arg === "string") {
      out.push(`${prefix}"${arg}"`);
    } else if (typeof arg === "number") {
      out.push(`${prefix}${arg}`);
    } else if (typeof arg === "function") {
      out.push(`${prefix}${arg.prototype ? `${arg.name || "<function>"}()` : "() => {}"}`);
    } else if (Array.isArray(arg)) {
      out.push(`${prefix}<array(${arg.length})>`);
      for (const v of arg) {
        _(v, tab + 1);
      }
    } else if (typeof arg === "object") {
      out.push(`${prefix}<object>${Object.keys(arg).length === 0 ? " [empty]" : ""}`);
      for (const k in arg) {
        _(arg[k], tab + 1, k);
      }
    } else {
      out.push(`${prefix}<type "${typeof arg}">`);
    }
  }

  out.push("}");

  console.log(out.join("\n"));
}
