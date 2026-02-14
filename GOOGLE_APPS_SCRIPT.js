// ============================================================
// Brekkie Bakery — Google Apps Script Order Handler
// ============================================================
//
// SETUP INSTRUCTIONS:
//
// 1. Open the Brekkie Orders spreadsheet:
//    https://docs.google.com/spreadsheets/d/17vLCTk0o8A5Bn_csZFjJH3NBYYBKooOXFOV3KtmGJ9c/edit
// 2. Go to Extensions > Apps Script.
// 3. Delete any existing code and paste this entire file.
// 4. Click the "Run" button (▶) with `testSetup` selected in the
//    function dropdown. Google will ask you to authorize — follow
//    the prompts and grant access.
// 5. Click "Deploy" > "New deployment".
//    - Type: Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 6. Click "Deploy". Copy the Web App URL.
// 7. Add that URL as the GOOGLE_SCRIPT_URL environment variable:
//    - In .env.local for local development
//    - In Vercel: Settings > Environment Variables (all environments)
//
// HOW IT WORKS:
//   - Every order (preorder or wholesale) goes into a weekly tab
//   - Tabs are named "Week of Mon DD" (e.g. "Week of Feb 10")
//   - A new tab is auto-created each Monday
//   - Online orders from the website have Sales Agent = "Online"
//   - Your field sales team's orders (Fahiye, Ay, etc.) can be
//     entered directly into the sheet — same format
//
// COLUMNS:
//   Date | Type | Name/Business | Address | Phone | Email |
//   Contact | Sales Agent | Classic | Blueberry | Walnut |
//   Total Loaves | Frequency | Status | Notes
//
// ============================================================

var SPREADSHEET_ID = "17vLCTk0o8A5Bn_csZFjJH3NBYYBKooOXFOV3KtmGJ9c";

var HEADERS = [
  "Date",
  "Type",
  "Name / Business",
  "Address",
  "Phone",
  "Email",
  "Contact (Manager)",
  "Sales Agent",
  "Classic",
  "Blueberry",
  "Walnut",
  "Total Loaves",
  "Frequency",
  "Status",
  "Notes"
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = getOrCreateWeeklySheet(ss);

    if (data.formType === "preorder") {
      writePreorder(sheet, data);
    } else if (data.formType === "wholesale") {
      writeWholesale(sheet, data);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify({ error: "Unknown form type" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ---- Weekly sheet management ----

function getWeekSheetName(date) {
  // Find the Monday of the given date's week
  var d = new Date(date);
  var day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  var diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days
  d.setDate(d.getDate() + diff);

  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return "Week of " + months[d.getMonth()] + " " + d.getDate();
}

function getOrCreateWeeklySheet(ss) {
  var sheetName = getWeekSheetName(new Date());
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName, 0); // Insert at front (most recent first)

    // Write headers
    sheet.appendRow(HEADERS);

    // Style header row
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#1B2A4A"); // navy
    headerRange.setFontColor("#FEFCF3");  // cream
    headerRange.setHorizontalAlignment("center");

    // Set column widths for readability
    sheet.setColumnWidth(1, 90);   // Date
    sheet.setColumnWidth(2, 80);   // Type
    sheet.setColumnWidth(3, 180);  // Name/Business
    sheet.setColumnWidth(4, 200);  // Address
    sheet.setColumnWidth(5, 120);  // Phone
    sheet.setColumnWidth(6, 180);  // Email
    sheet.setColumnWidth(7, 120);  // Contact
    sheet.setColumnWidth(8, 100);  // Sales Agent
    sheet.setColumnWidth(9, 60);   // Classic
    sheet.setColumnWidth(10, 70);  // Blueberry
    sheet.setColumnWidth(11, 60);  // Walnut
    sheet.setColumnWidth(12, 90);  // Total Loaves
    sheet.setColumnWidth(13, 90);  // Frequency
    sheet.setColumnWidth(14, 80);  // Status
    sheet.setColumnWidth(15, 200); // Notes

    // Freeze header row
    sheet.setFrozenRows(1);
  }

  return sheet;
}

// ---- Write order rows ----

function writePreorder(sheet, data) {
  var classic = data.classicQty || 0;
  var blueberry = data.blueberryQty || 0;
  var walnut = data.walnutQty || 0;
  var total = classic + blueberry + walnut;

  var notes = [];
  if (data.pickupDate) notes.push("Pickup: " + data.pickupDate);
  if (data.specialInstructions) notes.push(data.specialInstructions);

  sheet.appendRow([
    formatDate(data.submittedAt || new Date()),
    "Preorder",
    data.name || "",
    "Pickup",
    data.phone || "",
    data.email || "",
    "",                          // Contact — same as customer for preorders
    "Online",                    // Sales Agent
    classic,
    blueberry,
    walnut,
    total,
    "One-time",
    "New",                       // Status — starts as New
    notes.join(" | ")
  ]);
}

function writeWholesale(sheet, data) {
  var classic = data.classicQty || 0;
  var blueberry = data.blueberryQty || 0;
  var walnut = data.walnutQty || 0;
  var total = classic + blueberry + walnut;

  var notes = [];
  if (data.specialInstructions) notes.push(data.specialInstructions);

  var frequency = data.frequency || "One-time";
  // Capitalize first letter
  frequency = frequency.charAt(0).toUpperCase() + frequency.slice(1).replace("-", "-");

  sheet.appendRow([
    formatDate(data.submittedAt || new Date()),
    "Wholesale",
    data.businessName || "",
    data.deliveryAddress || "",
    data.phone || "",
    data.email || "",
    data.contactName || "",      // Contact (Manager at the store)
    "Online",                    // Sales Agent — website orders
    classic,
    blueberry,
    walnut,
    total,
    frequency,
    "New",                       // Status — starts as New
    notes.join(" | ")
  ]);
}

// ---- Helpers ----

function formatDate(dateInput) {
  var d;
  if (typeof dateInput === "string") {
    d = new Date(dateInput);
  } else {
    d = dateInput;
  }
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[d.getMonth()] + " " + d.getDate();
}

// ---- Test / Setup ----

function testSetup() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log("Spreadsheet name: " + ss.getName());
  Logger.log("Spreadsheet ID: " + ss.getId());

  // Create this week's sheet as a test
  var sheet = getOrCreateWeeklySheet(ss);
  Logger.log("Current week sheet: " + sheet.getName());
  Logger.log("Setup verified successfully");
}

// Manual helper: create a sheet for any week (run from script editor)
// Usage: createSheetForDate(new Date("2026-02-17"))
function createSheetForDate(date) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheetName = getWeekSheetName(date);
  var existing = ss.getSheetByName(sheetName);
  if (existing) {
    Logger.log("Sheet already exists: " + sheetName);
    return;
  }
  // Temporarily override to create the sheet
  var sheet = ss.insertSheet(sheetName, 0);
  sheet.appendRow(HEADERS);
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#1B2A4A");
  headerRange.setFontColor("#FEFCF3");
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  Logger.log("Created sheet: " + sheetName);
}
