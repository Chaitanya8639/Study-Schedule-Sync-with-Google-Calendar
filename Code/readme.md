---

## 🚀 What Does setupScheduleSync() Do?
The setupScheduleSync() function is your one-click setup to automate everything. It performs the following operations to prepare the entire system:

✅ Creates a custom menu in your Google Sheet titled Schedule Sync, giving you quick access to sync features.

🗓 Checks for the calendar named Weekly Study Schedule. If it doesn’t exist, it creates one for you.

🔄 Installs time-based triggers:

createWeeklyEvents() — runs every Monday at 8:00 AM to generate weekly events.

updateAttendanceFromCalendar() — runs daily at 6:00 PM to fetch and record calendar RSVP responses.

✏️ Installs an on-edit trigger (onEditSchedule(e)) that listens for changes in the Week Schedule sheet and updates the corresponding calendar event in real time.

📃 Creates the Weekly Events sheet (if missing) to log attendance details like event status and response time.

🔐 Requests permissions for Google Sheets and Google Calendar so the script can access and modify them.
You can find it in [code.gs]().
---
