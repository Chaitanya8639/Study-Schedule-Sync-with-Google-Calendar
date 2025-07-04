# 📅 Study Schedule Sync with Google Calendar

A **Google Apps Script** project that syncs your weekly study timetable from **Google Sheets** to **Google Calendar**. It automates event creation, tracks calendar responses, and updates schedules dynamically when the sheet is edited, so you can focus more on learning and less on planning.

---

## ✨ Features

- ✅ Automatically creates calendar events (Mon–Sun)
- 🍱 Skips "Lunch" blocks (case-insensitive)
- 🔁 Daily recurring events for **Updates** and **Reflection / Journal**
- ⏰ Adds 5-minute **popup & email reminders**
- 🗓 Tracks attendance in a `Weekly Events` sheet
- ✏️ Auto-updates calendar when sheet start/end times or activities change
- 📆 Weekly auto-sync every **Monday at 8:00 AM**
- 📬 Fetches attendance responses daily at **6:00 PM**

---

## 📁 Files Included
- [Code.gs]()  # Main Google Apps Script code
- [appsscript.json]() # Project manifest file

---

## 📋 Google Sheet Format

The project uses a sheet named `Week Schedule` with the following layout:

| Column | Purpose                             |
|--------|--------------------------------------|
| A      | Start Time (Mon–Fri, 24hr format)    |
| B      | End Time (Mon–Fri, 24hr format)      |
| C–G    | Activities from Monday to Friday     |
| H      | Start Time for Saturday & Sunday     |
| I      | End Time for Saturday & Sunday       |
| J      | Saturday Activities                  |
| K      | Sunday Activities                    |

 - Refer to this Schedule [Sample Schedule.png]()
---

## ⚙️ Setup Instructions

### 1. Create Your Schedule Sheet

- Open [Google Sheets](https://sheets.new)
- Rename the first tab to: `Week Schedule`
- Fill in your weekly timetable using the format shown above

### 2. Add the Script Code

- Go to `Extensions → Apps Script`
- Remove the default code in `Code.gs`
- Paste in the contents from this repo’s `Code.gs`
- Save and name your script via `File → Project Settings`

### 3. Authorize & Initialize

- In the Apps Script editor, select the function `setupScheduleSync()` from the dropdown
- Click ▶️ Run once to:
  - Grant Calendar & Sheets permissions
  - Create the custom `Schedule Sync` menu
  - Install all required time-based and edit triggers

### 4. Create Calendar Events

- Return to your sheet
- Use the new menu: `Schedule Sync → Create Calendar Events`
- Events will be created in a calendar titled: **Weekly Study Schedule**

---

## ⏰ Auto Triggers

| Task                   | Trigger Time          |
|------------------------|-----------------------|
| 🗓 Create Weekly Events   | Every Monday at 8:00 AM |
| 📬 Update Attendance      | Every Day at 6:00 PM     |
| ✏️ Update on Sheet Edit   | On every sheet edit      |

> 📌 All triggers are auto-installed via the `setupScheduleSync()` function.

---

## 🧾 Attendance Tracking

A new sheet named `Weekly Events` is created to track attendance from calendar responses. It logs:

| Column           | Description                            |
|------------------|----------------------------------------|
| Event Title      | Activity Title                         |
| Date & Time      | Start and End Time                     |
| Response Status  | Accepted / Declined / Tentative / None |
| Response Time    | Timestamp of the calendar response     |

---

## 🧪 Development Tips

- Use `Logger.log()` for debugging (`View > Logs`)
- Run functions manually before relying on auto-triggers:
  - `createWeeklyEvents()`
  - `updateAttendanceFromCalendar()`
- Ensure consistency in sheet formatting
- Use installable triggers only (not `onEdit()` directly)

---

## 🔗 Useful Resources

- 📘 [Google Apps Script Docs](https://developers.google.com/apps-script)
- 📖 [Calendar Service Reference](https://developers.google.com/apps-script/reference/calendar)
- 📖 [Spreadsheet Service Reference](https://developers.google.com/apps-script/reference/spreadsheet)

---

## 💻 Tech Stack

- Google Apps Script (V8 Runtime)
- Google Calendar API
- Google Sheets

---

## 🤝 Contributing

Have ideas or feedback?

- ⭐ Star this repo to support it
- 🐛 [Open an issue](Issues)
- 🔧 Submit a pull request — all contributions are welcome!

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).

---

> Made with 💻 + ☕ by [Chaitanya](https://github.com/Chaitanya8639)  
> Boost your focus. Automate your routine. 📆✨
