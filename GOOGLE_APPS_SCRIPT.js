// ============================================================
// Brekkie Bakery — Google Apps Script Order Handler
// ============================================================
//
// SETUP INSTRUCTIONS:
//
// 1. Create a new Google Sheet (name it "Brekkie Orders" or similar).
// 2. Open Extensions > Apps Script.
// 3. Delete the default `myFunction` code and paste this entire file.
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
// The script automatically creates two sheet tabs on first submission:
//   - "Customer Preorders"
//   - "Wholesale Orders"
//
// ============================================================

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (data.formType === "preorder") {
      handlePreorder(ss, data);
    } else if (data.formType === "wholesale") {
      handleWholesale(ss, data);
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

function handlePreorder(ss, data) {
  let sheet = ss.getSheetByName("Customer Preorders");

  // Create sheet with headers if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet("Customer Preorders");
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Email",
      "Phone",
      "Classic Choc Chip Qty",
      "Blueberry Choc Chip Qty",
      "Walnut Choc Chip Qty",
      "Preferred Pickup Date",
      "Special Instructions",
      "Submitted At"
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight("bold");
  }

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.email || "",
    data.phone || "",
    data.classicQty || 0,
    data.blueberryQty || 0,
    data.walnutQty || 0,
    data.pickupDate || "",
    data.specialInstructions || "",
    data.submittedAt || ""
  ]);
}

function handleWholesale(ss, data) {
  let sheet = ss.getSheetByName("Wholesale Orders");

  // Create sheet with headers if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet("Wholesale Orders");
    sheet.appendRow([
      "Timestamp",
      "Business Name",
      "Contact Name",
      "Email",
      "Phone",
      "Business Type",
      "Classic Choc Chip Qty (loaves)",
      "Blueberry Choc Chip Qty (loaves)",
      "Walnut Choc Chip Qty (loaves)",
      "Delivery Address",
      "Frequency",
      "Special Instructions",
      "Submitted At"
    ]);
    sheet.getRange(1, 1, 1, 13).setFontWeight("bold");
  }

  sheet.appendRow([
    new Date(),
    data.businessName || "",
    data.contactName || "",
    data.email || "",
    data.phone || "",
    data.businessType || "",
    data.classicQty || 0,
    data.blueberryQty || 0,
    data.walnutQty || 0,
    data.deliveryAddress || "",
    data.frequency || "",
    data.specialInstructions || "",
    data.submittedAt || ""
  ]);
}

// Run this manually first to verify sheet access and grant permissions
function testSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("Spreadsheet name: " + ss.getName());
  Logger.log("Spreadsheet ID: " + ss.getId());
  Logger.log("Setup verified successfully");
}
