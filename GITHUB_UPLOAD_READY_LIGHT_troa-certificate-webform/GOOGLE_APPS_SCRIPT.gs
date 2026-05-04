const SHEET_NAME = "responses";
const SECRET = ""; // GOOGLE_SCRIPT_SECRET을 쓸 경우 같은 값을 입력하세요.

function doPost(e) {
  try {
    if (SECRET) {
      const incomingSecret = e.parameter.secret || "";
      // Apps Script 웹앱은 커스텀 헤더를 직접 읽기 까다로워서,
      // 필요하면 URL에 ?secret=... 형태로 붙여 쓰는 방식도 가능합니다.
      if (incomingSecret !== SECRET) {
        return json({ ok: false, message: "unauthorized" });
      }
    }

    const payload = JSON.parse(e.postData.contents);
    const sheet = getSheet();
    ensureHeader(sheet);

    sheet.appendRow([
      payload.submittedAt,
      payload.orderNumber,
      payload.email,
      payload.certificateNo,
      payload.title,
      payload.awardCategory,
      payload.recipient,
      payload.body,
      payload.date,
      payload.presenter,
      payload.stamp,
      payload.stampLabel,
      payload.autoSpacingEnabled,
      JSON.stringify(payload.raw),
    ]);

    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, message: String(error) });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function ensureHeader(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow([
    "submittedAt",
    "orderNumber",
    "email",
    "certificateNo",
    "title",
    "awardCategory",
    "recipient",
    "body",
    "date",
    "presenter",
    "stamp",
    "stampLabel",
    "autoSpacingEnabled",
    "rawJson",
  ]);
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
