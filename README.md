# 📅 Study Schedule Sync with Google Calendar

This Google Apps Script project syncs your study timetable from a Google Sheet into your Google Calendar. It creates scheduled events, handles reminders, auto-updates on edit, and tracks attendance responses.

## 📌 Features

- Create calendar events for each activity block (Mon–Sun)
- Skips lunch blocks automatically
- Creates recurring daily "Updates" and "Reflection / Journal" sessions
- Adds 5-minute popup and email reminders
- Tracks user responses (Accepted, Declined, Tentative)
- Automatically updates calendar + sheet on time/activity edits
- Scheduled auto-sync every Monday 8:00 AM
- Attendance update every day at 6:00 PM

## 🗓 Sheet Format (`Week Schedule`)

| Column | Info |
|--------|------|
| A      | Start Time (24hr) |
| B      | End Time (24hr) |
| C–G    | Monday to Friday activities |
| J–K    | Saturday (J) and Sunday (K) activities |

## 🧪 Getting Started

1. Create a new Google Sheet and name the tab `Week Schedule`
2. Paste `Code.gs` into the Apps Script Editor (`Extensions → Apps Script`)
3. Run `setupScheduleSync()` once to enable the menu
4. Use the menu `Schedule Sync > Create Calendar Events`
5. View synced events in your calendar!

## 🔁 Triggers

| Task | Time |
|------|------|
| Create Events | Every Monday, 8:00 AM |
| Update Attendance | Every day, 6:00 PM |

## 🛠 Tech

- Google Apps Script
- Google Sheets
- Google Calendar

## 📬 Feedback or Contribution

Feel free to fork, improve, and contribute to make this better!
