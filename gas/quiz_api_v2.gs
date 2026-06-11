const SHEET_NAME = 'Questions';

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getQuestions') {
    return jsonResponse(getQuestions(e));
  }

  if (action === 'checkAnswer') {
    return jsonResponse(checkAnswer(e));
  }

  return jsonResponse({
    ok: false,
    error: 'Unknown action'
  });
}

function getQuestions(e) {
  const levelId = e.parameter.levelId || 'lesson8';
  const count = Number(e.parameter.count || 15);

  if (levelId === 'final') {
    return getFinalQuestions(count);
  }

  const questions = getAllRows()
    .filter(row => row.enabled === true)
    .filter(row => row.levelId === levelId);

  const picked = shuffle(questions).slice(0, count);

  return {
    ok: true,
    levelId,
    count: picked.length,
    questions: picked.map(toPublicQuestion)
  };
}

function getFinalQuestions(count) {
  const questions = getAllRows()
    .filter(row => row.enabled === true);

  const byPaper = {};

  questions.forEach(row => {
    if (!byPaper[row.paperName]) {
      byPaper[row.paperName] = [];
    }
    byPaper[row.paperName].push(row);
  });

  const picked = shuffle(Object.keys(byPaper))
    .map(paperName => {
      const paperQuestions = byPaper[paperName];
      return paperQuestions[Math.floor(Math.random() * paperQuestions.length)];
    })
    .slice(0, count);

  return {
    ok: true,
    levelId: 'final',
    count: picked.length,
    questions: picked.map(toPublicQuestion)
  };
}

function toPublicQuestion(row) {
  return {
    id: row.id,
    levelId: row.levelId,
    levelName: row.levelName,
    paperName: row.paperName,
    question: row.question,
    options: [
      row.optionA,
      row.optionB,
      row.optionC,
      row.optionD
    ]
  };
}

function checkAnswer(e) {
  const id = e.parameter.id;
  const answer = String(e.parameter.answer || '').toUpperCase();

  const row = getAllRows().find(item => item.id === id);

  if (!row) {
    return {
      ok: false,
      error: 'Question not found'
    };
  }

  const correct = row.answer === answer;

  return {
    ok: true,
    id: row.id,
    correct,
    studentAnswer: answer,
    answer: row.answer,
    answerIndex: row.answerIndex,
    explanation: row.explanation
  };
}

function getAllRows() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();

  return values.map(row => {
    const item = {};

    headers.forEach((header, index) => {
      item[header] = row[index];
    });

    item.enabled = String(item.enabled).toUpperCase() === 'TRUE';
    item.answer = String(item.answer).toUpperCase();
    item.answerIndex = Number(item.answerIndex);

    return item;
  });
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function shuffle(items) {
  const copied = [...items];

  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copied[i];
    copied[i] = copied[j];
    copied[j] = temp;
  }

  return copied;
}
