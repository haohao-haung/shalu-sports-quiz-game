import json
import re
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "questions.js"
LETTERS = "ABCD"


def load_data():
    text = DATA_PATH.read_text(encoding="utf-8")
    text = re.sub(r"^\s*window\.QUIZ_DATA\s*=\s*", "", text)
    text = re.sub(r";\s*$", "", text)
    return json.loads(text)


def repeated_tail(explanation):
    pieces = re.findall(r"[（(]\s*\d+\s*[.．、][^（）()]{8,}", explanation)
    numbers = [re.match(r"[（(]\s*(\d+)", piece).group(1) for piece in pieces if re.match(r"[（(]\s*(\d+)", piece)]
    return sorted({number for number in numbers if numbers.count(number) > 1})


def chosen_letters(explanation):
    found = []
    patterns = [
        r"故選[（(]?([ABCD])[）)]?",
        r"應選[（(]?([ABCD])[）)]?",
        r"答案[為是]?[（(]?([ABCD])[）)]?",
    ]
    for pattern in patterns:
        found.extend(re.findall(pattern, explanation))
    return found


def main():
    data = load_data()
    issues = []
    seen_explanations = {}
    total = 0

    for lesson in data["lessons"]:
        for question in lesson["questions"]:
            total += 1
            explanation = question.get("explanation", "").strip()
            answer_letter = LETTERS[question["answer"]]
            qid = question["id"]

            if not explanation:
                issues.append(("empty", qid, "解析是空的"))
                continue

            normalized = re.sub(r"\s+", "", explanation)
            if normalized in seen_explanations and len(normalized) > 28:
                issues.append(("exact_duplicate", qid, f"與 {seen_explanations[normalized]} 的解析完全相同"))
            else:
                seen_explanations[normalized] = qid

            repeated = repeated_tail(explanation)
            if repeated:
                issues.append(("repeated_embedded", qid, f"解析中重複出現疑似題號段落：{', '.join(repeated)}"))

            if "） （" in explanation or ") (" in explanation:
                issues.append(("embedded_other", qid, "解析中出現多段括號題號，疑似黏到其他題"))

            letters = chosen_letters(explanation)
            wrong_letters = sorted({letter for letter in letters if letter != answer_letter})
            if wrong_letters:
                issues.append(("answer_mismatch", qid, f"答案是 {answer_letter}，但解析文字出現故選/應選 {', '.join(wrong_letters)}"))

    print(f"total_questions={total}")
    print(f"issues={len(issues)}")
    for kind, qid, message in issues:
        print(f"{kind}\t{qid}\t{message}")


if __name__ == "__main__":
    main()
