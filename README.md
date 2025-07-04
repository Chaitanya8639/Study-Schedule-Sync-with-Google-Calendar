# 📅 Study Schedule Sync with Google Calendar

A Google Apps Script project to sync your weekly study timetable from **Google Sheets** to **Google Calendar**. It automates event creation, tracks calendar responses, and updates schedules dynamically when the sheet is edited.

---

## 📌 Features

- ✅ Create Google Calendar events for each activity block (Mon–Sun)
- 🍱 Automatically skips **Lunch** blocks (case-insensitive)
- 🔁 Recurring daily events for **Updates** and **Reflection / Journal**
- ⏰ Adds **5-minute popup and email reminders**
- 🗓 Attendance is tracked in a separate `Weekly Events` sheet
- ✏️ Sheet + calendar auto-update when you edit **start/end times or activities**
- 🔁 Scheduled auto-sync **every Monday at 8:00 AM**
- 📬 Attendance responses are fetched daily **at 6:00 PM**

---

## 📁 Folder Structure

study-schedule-sync/
- 📜 Code.gs → Main Google Apps Script code
- 📜 appsscript.json → Project manifest for Google Apps Script
- 📜 README.md → Project documentation (this file)

  
---

---

## 📋 Google Sheet Format

The project uses a sheet named **`Week Schedule`** with the following layout:

| Column | Purpose                           |
|--------|------------------------------------|
| A      | Start Time (Mon–Fri) (24hr format) |
| B      | End Time (Mon–Fri) (24hr format)   |
| C–G    | Activities from Monday to Friday   |
| H      | Start Time for Weekend             |
| I      | End Time for Weekend               |
| J      | Saturday Activities                |
| K      | Sunday Activities                  |

---

## ✅ Setup Instructions

### 1. 📋 Create Your Schedule Sheet

- Open Google Sheets
- Rename the first tab to: `Week Schedule`
- Fill in your weekly timetable in the specified format

### 2. 🧑‍💻 Add Apps Script Code

- Go to `Extensions → Apps Script`
- Delete the default `Code.gs` content
- Paste the contents of `Code.gs` from this repo
- Go to `File → Project Settings` and name your script

### 3. 🔐 Authentication

- In the Apps Script editor, select the `setupScheduleSync()` function from the dropdown
- Click ▶️ **Run** once to:
  - Authorize Google Sheets and Calendar access
  - Set up the `Schedule Sync` menu
  - Create installable triggers

### 4. 📆 Start Syncing

- Go back to your sheet
- Use the menu: `Schedule Sync > Create Calendar Events`
- Done! Calendar events will appear under `Weekly Study Schedule`

---

## ⏰ Auto Triggers (Set Up Automatically)

| Task                   | Trigger Time     |
|------------------------|------------------|
| Create Weekly Events   | Every Monday 8:00 AM |
| Update Attendance      | Every Day 6:00 PM    |
| Update on Sheet Edit   | On any sheet edit (manual trigger)

---

## 📋 Attendance Tracking

A new sheet `Weekly Events` is auto-created to track:

- Event status (Accepted / Declined / Tentative / Pending)
- Response time
- Event details (title, date, time, activity)

---

## 🔗 Useful Links

- [📘 Google Apps Script Docs](https://developers.google.com/apps-script)
- [📖 Calendar Service Reference](https://developers.google.com/apps-script/reference/calendar)
- [📖 Spreadsheet Service Reference](https://developers.google.com/apps-script/reference/spreadsheet)

---

## 🛠 Tech Stack

- Google Apps Script (V8 Runtime)
- Google Calendar API
- Google Sheets

---

## 🧪 Local Development Tips

- Use `Logger.log()` for debugging (`View > Logs`)
- Test `createWeeklyEvents()` and `updateAttendanceFromCalendar()` manually before relying on triggers
- Watch for sheet edits that update times or activities

---

## 🤝 Contribution

💡 Found a bug? Got a suggestion?

Feel free to:

- ⭐ Star this repo
- 🐛 Open an issue
- 📬 Submit a pull request

Let's improve learning productivity, one calendar event at a time! 🧠📆

---

## 📄 License

[MIT License](LICENSE)

---

Made with 💻 + ☕ by [Chaitanya](https://github.com/Chaitanya8639)
