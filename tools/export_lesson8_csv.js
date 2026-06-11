const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync("data/questions.js", "utf8"), ctx);

const lesson = ctx.window.QUIZ_DATA.lessons.find((item) => item.id === "lesson8");
if (!lesson) {
  throw new Error("lesson8 not found");
}

const letters = ["A", "B", "C", "D", "E", "F"];
const headers = [
  "id",
  "levelId",
  "levelName",
  "paperName",
  "question",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "answer",
  "answerIndex",
  "explanation",
  "enabled"
];

function csvCell(value) {
  return `"${String(value ?? "")
    .replaceAll('"', '""')
    .replaceAll("\r", " ")
    .replaceAll("\n", " ")}"`;
}

const rows = lesson.questions.map((question) => [
  question.id,
  lesson.id,
  lesson.subtitle,
  question.source,
  question.question,
  question.options[0],
  question.options[1],
  question.options[2],
  question.options[3],
  letters[question.answer],
  question.answer,
  question.explanation,
  "TRUE"
]);

const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
const outputDir = path.resolve("outputs");
const outputPath = path.join(outputDir, "lesson8_questions_google_sheet.csv");

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, csv, "utf8");

console.log(JSON.stringify({ file: outputPath, rows: rows.length, headers }, null, 2));
