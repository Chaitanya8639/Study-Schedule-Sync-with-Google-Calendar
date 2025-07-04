---

## 🚀 What Does `setupScheduleSync()` Do?

The `setupScheduleSync()` function is your one-click setup to automate everything. It performs the following actions:

1. ✅ **Creates a custom menu** in your Google Sheet (`Schedule Sync`)
2. 🗓 **Ensures your Calendar exists** (creates it if missing)
3. 🔄 **Sets up time-based triggers:**
   - `createWeeklyEvents()` runs every **Monday at 8:00 AM**
   - `updateAttendanceFromCalendar()` runs daily at **6:00 PM**
4. ✏️ **Sets an installable trigger** that listens for sheet edits and calls `onEditSchedule(e)`
5. 📃 Ensures the `Weekly Events` sheet exists for attendance logging.
6. 🔐 Requests the necessary permissions for Calendar and Sheet access

You only need to run it once — it automates everything afterward.
You can find it in [code.gs]().
---
