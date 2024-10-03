import rand from "./rand.js";

export default function randOf(array) {
  return array[rand(0, array.length - 1)];
}
