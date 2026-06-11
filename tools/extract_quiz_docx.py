import argparse
import json
import re
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
CHOICE_RE = re.compile(r"[（(]\s*([A-DＡ-Ｄ])\s*[)）]")
ANSWER_AT_START_RE = re.compile(r"^[（(]\s*([A-DＡ-Ｄ])\s*[)）]\s*(\d{1,2})[.．、]\s*(.*)")
ANSWER_RE = re.compile(r"[（(]\s*([A-DＡ-Ｄ])\s*[)）]\s*(\d{1,2})[.．、]\s*")
QUESTION_RE = re.compile(r"^(\d{1,2})[.．、]\s*(.*)")
SECTION_RE = re.compile(r"^[一二三四五六七八九十]+、")


def fullwidth_to_ascii(text):
    table = str.maketrans({
        "Ａ": "A",
        "Ｂ": "B",
        "Ｃ": "C",
        "Ｄ": "D",
        "Ｅ": "E",
        "１": "1",
        "２": "2",
        "３": "3",
        "４": "4",
        "５": "5",
        "６": "6",
        "７": "7",
        "８": "8",
        "９": "9",
        "０": "0",
    })
    return text.translate(table)


def clean_text(text):
    text = fullwidth_to_ascii(text)
    text = text.replace("\u3000", " ")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def paragraph_text_and_break(paragraph):
    pieces = []
    page_break_after = False
    for child in paragraph.iter():
        if child.tag == f"{{{NS['w']}}}t" and child.text:
            pieces.append(child.text)
        elif child.tag == f"{{{NS['w']}}}tab":
            pieces.append(" ")
        elif child.tag == f"{{{NS['w']}}}br" and child.attrib.get(f"{{{NS['w']}}}type") == "page":
            page_break_after = True
        elif child.tag == f"{{{NS['w']}}}lastRenderedPageBreak":
            page_break_after = True
    return "".join(pieces), page_break_after


def read_docx_lines(path):
    with zipfile.ZipFile(path) as archive:
        xml = archive.read("word/document.xml")
    root = ET.fromstring(xml)
    lines = []
    page = 1
    for paragraph in root.findall(".//w:p", NS):
        text, page_break = paragraph_text_and_break(paragraph)
        text = clean_text(text)
        if text:
            lines.append({"page": page, "text": text})
        if page_break:
            page += 1
    return lines


def split_inline_options(text):
    matches = list(CHOICE_RE.finditer(text))
    if len(matches) < 4:
        return None
    question = clean_text(text[: matches[0].start()])
    options = []
    for index, match in enumerate(matches[:4]):
        start = match.end()
        end = matches[index + 1].start() if index < 3 else len(text)
        options.append(clean_option(text[start:end]))
    return question, options


def clean_option(text):
    text = clean_text(text)
    text = text.replace("錯誤! 尚未指定書籤名稱。", "")
    text = re.sub(r"\s*[（(]\s*\d{1,2}[.．、].*$", "", text)
    return clean_text(text)


def extract_explanation(prelude, number):
    prelude = clean_text(prelude)
    matches = list(re.finditer(rf"[（(]\s*{number}\s*[.．、]", prelude))
    if not matches:
        return ""
    explanation = prelude[matches[-1].end():].strip()
    explanation = re.sub(r"^[：:]\s*", "", explanation)
    explanation = re.sub(r"[）)]\s*$", "", explanation).strip()
    explanation = re.sub(rf"\s*[（(]\s*{number}\s*[.．、].*$", "", explanation).strip()
    return clean_text(explanation)


def find_answer_matches(text):
    return list(ANSWER_RE.finditer(text))


def build_explanation_lookup(text):
    lookup = {}
    matches = find_answer_matches(text)
    for index, match in enumerate(matches):
        number = int(match.group(2))
        prelude_start = matches[index - 1].end() if index > 0 else 0
        explanation = extract_explanation(text[prelude_start:match.start()], number)
        if explanation and "解析見卷末" not in explanation:
            lookup[number] = explanation
    return lookup


def apply_stop_section(lines, stop_section):
    if not stop_section:
        return lines
    kept = []
    for row in lines:
        if stop_section in row["text"]:
            break
        kept.append(row)
    return kept


def extract_multiple_choice(lines, start=None, end=None, page=None, stop_section=None):
    filtered = [row for row in lines if page is None or row["page"] == page]
    full_text = "\n".join(row["text"] for row in filtered)
    explanation_lookup = build_explanation_lookup(full_text)
    filtered = apply_stop_section(filtered, stop_section)
    text = "\n".join(row["text"] for row in filtered)
    matches = find_answer_matches(text)
    questions = []

    for index, match in enumerate(matches):
        number = int(match.group(2))
        if start is not None and number < start:
            continue
        if end is not None and number > end:
            continue

        segment_end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        segment = clean_text(text[match.end():segment_end])
        inline = split_inline_options(segment)
        if not inline:
            continue

        question, options = inline
        if not question or len(options) < 4:
            continue

        prelude_start = matches[index - 1].end() if index > 0 else 0
        explanation = extract_explanation(text[prelude_start:match.start()], number)
        if "解析見卷末" in explanation:
            explanation = explanation_lookup.get(number, "")
        source_page = next((row["page"] for row in filtered if row["text"] in text[:match.start() + 1]), None)
        questions.append({
            "number": number,
            "answer": "ABCD".index(fullwidth_to_ascii(match.group(1))),
            "question": question,
            "options": options[:4],
            "explanation": explanation,
            "section": "",
            "page": source_page,
        })

    unique = {}
    for question in questions:
        unique[question["number"]] = question
    return [unique[number] for number in sorted(unique)]


def summarize(path):
    lines = read_docx_lines(path)
    by_page = {}
    for row in lines:
        by_page.setdefault(row["page"], []).append(row["text"])
    return {
        "path": str(path),
        "pages": [
            {
                "page": page,
                "line_count": len(items),
                "first_lines": items[:8],
                "answer_questions": [
                    int(m.group(2))
                    for item in items
                    for m in [ANSWER_AT_START_RE.match(item)]
                    if m
                ][:30],
            }
            for page, items in sorted(by_page.items())
        ],
    }


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    parser = argparse.ArgumentParser()
    parser.add_argument("--summary", action="store_true")
    parser.add_argument("--extract", action="store_true")
    parser.add_argument("--start", type=int)
    parser.add_argument("--end", type=int)
    parser.add_argument("--page", type=int)
    parser.add_argument("--stop-section")
    parser.add_argument("paths", nargs="+")
    args = parser.parse_args()

    outputs = []
    for raw in args.paths:
        path = Path(raw)
        if args.summary:
            outputs.append(summarize(path))
        elif args.extract:
            lines = read_docx_lines(path)
            outputs.append({
                "path": str(path),
                "questions": extract_multiple_choice(lines, args.start, args.end, args.page, args.stop_section),
            })
    print(json.dumps(outputs, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
