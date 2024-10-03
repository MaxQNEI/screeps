export default function UpperCaseFirst(string) {
  return string.replace(/(\w+)/g, (m, p1) => `${p1[0].toUpperCase()}${p1.slice(1).toLowerCase()}`);
}
