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
// 5. Click "Deploy" > "Manage deployments" > edit existing deployment.
//    - Who has access: Anyone
// 6. Click "Deploy".
//
// HOW IT WORKS:
//   - Every order (preorder or wholesale) goes into a weekly tab
//   - Tabs are named "Week of Mon DD" (e.g. "Week of Feb 10")
//   - A new tab is auto-created each Monday
//   - Online orders from the website have Sales Agent = "Online"
//   - Your field sales team's orders can be entered directly
//
// COLUMNS:
//   Date | Type | Name/Business | Address | Phone | Email |
//   Contact | Sales Agent | Classic | Blueberry | Walnut |
//   Total Loaves | Price/Loaf | Revenue | Frequency | Status | Notes
//
// PRICING:
//   - Price/Loaf is editable per row. Defaults:
//     Bodega/Cafe/Gym/Restaurant/Office = $30
//     Preorders = blank (edit manually if needed)
//   - For distributors, manually set Price/Loaf (e.g. $22.50)
//   - Revenue auto-calculates: Total Loaves × Price/Loaf
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
  "Price/Loaf",
  "Revenue",
  "Frequency",
  "Status",
  "Notes"
];

// Column indices (1-based)
var COL_TOTAL_LOAVES = 12;
var COL_PRICE = 13;
var COL_REVENUE = 14;

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
  var d = new Date(date);
  var day = d.getDay();
  var diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);

  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return "Week of " + months[d.getMonth()] + " " + d.getDate();
}

function getOrCreateWeeklySheet(ss) {
  var sheetName = getWeekSheetName(new Date());
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName, 0);

    // Write headers
    sheet.appendRow(HEADERS);

    // Style header row
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#1B2A4A");
    headerRange.setFontColor("#FEFCF3");
    headerRange.setHorizontalAlignment("center");

    // Column widths
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
    sheet.setColumnWidth(12, 95);  // Total Loaves
    sheet.setColumnWidth(13, 85);  // Price/Loaf
    sheet.setColumnWidth(14, 90);  // Revenue
    sheet.setColumnWidth(15, 90);  // Frequency
    sheet.setColumnWidth(16, 80);  // Status
    sheet.setColumnWidth(17, 200); // Notes

    // Format Price/Loaf and Revenue columns as currency
    sheet.getRange(2, COL_PRICE, 500).setNumberFormat("$#,##0.00");
    sheet.getRange(2, COL_REVENUE, 500).setNumberFormat("$#,##0.00");

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
  if (data.deliveryDate) notes.push("Delivery: " + data.deliveryDate);
  if (data.specialInstructions) notes.push(data.specialInstructions);

  var row = sheet.getLastRow() + 1;

  sheet.appendRow([
    formatDate(data.submittedAt || new Date()),
    "Preorder",
    data.name || "",
    data.deliveryAddress || "",
    data.phone || "",
    data.email || "",
    "",
    "Online",
    classic,
    blueberry,
    walnut,
    total,
    "",                          // Price/Loaf — blank for delivery, edit if needed
    "",                          // Revenue — formula set below
    "One-time",
    "New",
    notes.join(" | ")
  ]);

  setRevenueFormula(sheet, row);
}

function writeWholesale(sheet, data) {
  var classic = data.classicQty || 0;
  var blueberry = data.blueberryQty || 0;
  var walnut = data.walnutQty || 0;
  var total = classic + blueberry + walnut;

  var notes = [];
  if (data.specialInstructions) notes.push(data.specialInstructions);

  var frequency = data.frequency || "One-time";
  frequency = frequency.charAt(0).toUpperCase() + frequency.slice(1);

  var row = sheet.getLastRow() + 1;

  sheet.appendRow([
    formatDate(data.submittedAt || new Date()),
    "Wholesale",
    data.businessName || "",
    data.deliveryAddress || "",
    data.phone || "",
    data.email || "",
    data.contactName || "",
    "Online",
    classic,
    blueberry,
    walnut,
    total,
    30,                          // Price/Loaf — default $30 for wholesale
    "",                          // Revenue — formula set below
    frequency,
    "New",
    notes.join(" | ")
  ]);

  // Set Revenue formula
  setRevenueFormula(sheet, row);
}

// ---- Helpers ----

function setRevenueFormula(sheet, row) {
  // Revenue = Total Loaves × Price/Loaf (blank if no price set)
  var formula = '=IF(M' + row + '="","",L' + row + '*M' + row + ')';
  sheet.getRange(row, COL_REVENUE).setFormula(formula);
}

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

  var sheet = getOrCreateWeeklySheet(ss);
  Logger.log("Current week sheet: " + sheet.getName());
  Logger.log("Setup verified successfully");
}

function createSheetForDate(date) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheetName = getWeekSheetName(date);
  var existing = ss.getSheetByName(sheetName);
  if (existing) {
    Logger.log("Sheet already exists: " + sheetName);
    return;
  }
  var sheet = ss.insertSheet(sheetName, 0);
  sheet.appendRow(HEADERS);
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#1B2A4A");
  headerRange.setFontColor("#FEFCF3");
  headerRange.setHorizontalAlignment("center");
  sheet.getRange(2, COL_PRICE, 500).setNumberFormat("$#,##0.00");
  sheet.getRange(2, COL_REVENUE, 500).setNumberFormat("$#,##0.00");
  sheet.setFrozenRows(1);
  Logger.log("Created sheet: " + sheetName);
}
