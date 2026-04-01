export function normalizeText(value = "") {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function calculateDeterministicAtsScore(cvText = "", jdText = "") {
  const cv = normalizeText(cvText);
  const jd = normalizeText(jdText);

  const keywords = [...new Set(jd.split(" ").filter((word) => word.length > 4))];
  const matchedKeywords = keywords.filter((word) => cv.includes(word));
  const missingKeywords = keywords.filter((word) => !cv.includes(word)).slice(0, 12);

  const keywordScore = keywords.length ? (matchedKeywords.length / keywords.length) * 70 : 0;
  const sectionScore =
    (cv.includes("experience") ? 10 : 0) +
    (cv.includes("education") ? 10 : 0) +
    (cv.includes("skills") ? 10 : 0) +
    (cv.includes("summary") ? 10 : 0);

  const score = Math.max(0, Math.min(100, Math.round(keywordScore + sectionScore)));

  return {
    score,
    matchedKeywords,
    missingKeywords,
    summary:
      score >= 80
        ? "Your CV has a strong foundation for this role."
        : score >= 60
        ? "Your CV has potential, but can be optimized further."
        : "Your CV may not perform strongly for this role.",
  };
}