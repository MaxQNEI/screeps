import rand from "./rand.js";
import randOf from "./rand-of.js";

export default function randName() {
  const generate = (min = 1, max = 8) => {
    const length = rand(min, max);
    const vowels = "bcdfghjklmnpqrstvwxz";
    const consonants = "aeiouy";

    let hyphenation = false,
      lockHyphenation = false;

    let out = "";
    let vowel, consonant;
    while (out.length < length || out.slice(-3).indexOf("-") !== -1) {
      vowel = randOf(vowels);
      consonant = randOf(consonants);

      if (!hyphenation && rand(0, 100) > 90) {
        hyphenation = true;
        lockHyphenation = true;

        consonant = `${consonant}-`;
      }

      if (rand(0, 100) > 80 && !lockHyphenation) {
        consonant = `${consonant}${consonant}`;
      }

      out = `${out}${vowel}${consonant}`;
    }

    out = out.replace(/(\w+)/g, (m, p1) => `${p1[0].toUpperCase()}${p1.slice(1)}`);

    if (out.length > 2 && rand(0, 100) > 50) {
      out = out.slice(0, -1);
    }

    return out;
  };

  const out = [];
  out.push(generate());
  if (rand(0, 100) > 20) {
    if (rand(0, 100) > 80) {
      out.push(`${generate(1, 1)[0]}.`);
    }

    out.push(generate());
  }

  return out.join(" ");

  return new Array(rand(0, 100) > 20 ? 2 : 1).fill(null).map(generate).join(" ");
}
