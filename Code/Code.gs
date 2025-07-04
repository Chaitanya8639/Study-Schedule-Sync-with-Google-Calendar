// Google Apps Script for Schedule Sync with iPhone Calendar
// This script reads your Google Sheets timetable and creates calendar events

const SHEET_NAME = 'Week Schedule';
const EVENTS_SHEET_NAME = 'Weekly Events';
const CALENDAR_NAME = 'Weekly Study Schedule';
const REMINDER_MINUTES = 5;

function setupScheduleSync() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Schedule Sync')
    .addItem('Create Calendar Events', 'createWeeklyEvents')
    .addItem('Update Attendance Status', 'updateAttendanceFromCalendar')
    .addItem('Setup Weekly Trigger', 'setupWeeklyTrigger')
    .addToUi();
}

function onOpen() {
  setupScheduleSync();
}

function scheduleRecurringEventIfNeeded(calendar, eventName, timeRange, currentWeek, isScheduledFlag) {
  if (!isScheduledFlag.value) {
    const start = new Date(currentWeek[0]);
    start.setHours(timeRange.startHour, timeRange.startMin, 0, 0);

    const end = new Date(currentWeek[0]);
    end.setHours(timeRange.endHour, timeRange.endMin, 0, 0);

    const rule = CalendarApp.newRecurrence().addDailyRule().times(7);

    const userEmail = Session.getActiveUser().getEmail();

    const eventSeries = calendar.createEventSeries(eventName, start, end, rule, {
      guests: userEmail,
      sendInvites: true,
      description: `Recurring Event: ${eventName}`
    });

    eventSeries.removeAllReminders();
    eventSeries.addEmailReminder(REMINDER_MINUTES);
    eventSeries.addPopupReminder(REMINDER_MINUTES);

    isScheduledFlag.value = true;
  }
}

function createWeeklyEvents() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Sheet "' + SHEET_NAME + '" not found!');
    return;
  }

  let calendar = CalendarApp.getCalendarsByName(CALENDAR_NAME)[0];
  if (!calendar) {
    calendar = CalendarApp.createCalendar(CALENDAR_NAME);
  }

  const data = sheet.getDataRange().getValues();
  const currentWeek = getCurrentWeekDates();

  clearWeekEvents(calendar, currentWeek);

  const eventsSheet = createOrGetEventsSheet();
  clearAndSetupEventsSheet(eventsSheet, currentWeek[0]);

  let updatesScheduled = { value: false };
  let reflectionScheduled = { value: false };

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const startTime = row[0];
    const endTime = row[1];
    if (!startTime || !endTime) continue;

    const timeRange = parseTimeRange(startTime.toString(), endTime.toString());
    if (!timeRange) continue;

    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    for (let dayIndex = 0; dayIndex < weekdays.length; dayIndex++) {
      const columnIndex = dayIndex + 2;
      const activity = row[columnIndex];
      const dayName = weekdays[dayIndex];
      const dayDate = currentWeek[dayIndex];

      if (!activity || typeof activity !== 'string' || activity.trim() === '') continue;

      const activityText = activity.toString().trim().toLowerCase();
      if (activityText.includes('lunch')) continue;

      if (activityText === 'updates') {
        scheduleRecurringEventIfNeeded(calendar, 'Updates', timeRange, currentWeek, updatesScheduled);
        continue;
      }

      if (activityText === 'reflection / journal') {
        scheduleRecurringEventIfNeeded(calendar, 'Reflection / Journal', timeRange, currentWeek, reflectionScheduled);
        continue;
      }

      const event = createEventForDay(calendar, dayName, timeRange, activity.toString(), currentWeek, sheet, i + 1, columnIndex + 1);
      if (event) {
        addEventToEventsSheet(eventsSheet, eventsSheet.getLastRow() + 1, dayName, timeRange, activity, dayDate, event.getId());
      }
    }

    const weekendDays = ['Saturday', 'Sunday'];
    for (let dayIndex = 0; dayIndex < weekendDays.length; dayIndex++) {
      const columnIndex = dayIndex + 9;
      const activity = row[columnIndex];
      const dayName = weekendDays[dayIndex];
      const dayDate = currentWeek[dayIndex + 5];

      if (!activity || typeof activity !== 'string' || activity.trim() === '') continue;

      const activityText = activity.toString().trim().toLowerCase();
      if (activityText.includes('lunch')) continue;

      if (activityText === 'updates') {
        scheduleRecurringEventIfNeeded(calendar, 'Updates', timeRange, currentWeek, updatesScheduled);
        continue;
      }

      if (activityText === 'reflection / journal') {
        scheduleRecurringEventIfNeeded(calendar, 'Reflection / Journal', timeRange, currentWeek, reflectionScheduled);
        continue;
      }

      const event = createEventForDay(calendar, dayName, timeRange, activity.toString(), currentWeek, sheet, i + 1, columnIndex + 1);
      if (event) {
        addEventToEventsSheet(eventsSheet, eventsSheet.getLastRow() + 1, dayName, timeRange, activity, dayDate, event.getId());
      }
    }
  }

  Logger.log('Events created automatically');
}

// (The rest of the script remains unchanged)

function parseTimeRange(startTimeStr, endTimeStr) {
  const parseTime = (timeStr) => {
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!match) return null;
    let hour = parseInt(match[1]);
    const minute = parseInt(match[2]);
    return { hour, minute };
  };

  const startTime = parseTime(startTimeStr);
  const endTime = parseTime(endTimeStr);
  if (!startTime || !endTime) return null;

  return {
    startHour: startTime.hour,
    startMin: startTime.minute,
    endHour: endTime.hour,
    endMin: endTime.minute
  };
}

function getCurrentWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));

  return Array.from({ length: 7 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
}

function createEventForDay(calendar, dayName, timeRange, activity, weekDates, sheet, rowIndex, colIndex) {
  const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(dayName);
  const eventDate = weekDates[dayIndex];

  const startTime = new Date(eventDate);
  startTime.setHours(timeRange.startHour, timeRange.startMin, 0, 0);

  const endTime = new Date(eventDate);
  endTime.setHours(timeRange.endHour, timeRange.endMin, 0, 0);

  try {
    const userEmail = Session.getActiveUser().getEmail();
    const event = calendar.createEvent(`${activity} - ${dayName}`, startTime, endTime, {
      description: `Study Session: ${activity}\nDay: ${dayName}`,
      guests: userEmail,
      sendInvites: true
    });
    event.removeAllReminders();
    event.addEmailReminder(REMINDER_MINUTES);
    event.addPopupReminder(REMINDER_MINUTES);
    return event;
  } catch (e) {
    Logger.log(`Error creating event: ${e}`);
    return null;
  }
}

function clearWeekEvents(calendar, weekDates) {
  const events = calendar.getEvents(weekDates[0], new Date(weekDates[6].getFullYear(), weekDates[6].getMonth(), weekDates[6].getDate(), 23, 59, 59));
  events.forEach(event => {
    if (/ - (Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/.test(event.getTitle())) {
      event.deleteEvent();
    }
  });
}

function createOrGetEventsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let eventsSheet = spreadsheet.getSheetByName(EVENTS_SHEET_NAME);

  if (!eventsSheet) {
    eventsSheet = spreadsheet.insertSheet(EVENTS_SHEET_NAME);
    setupEventsSheetHeaders(eventsSheet);
  }

  return eventsSheet;
}

function setupEventsSheetHeaders(sheet) {
  const headers = [
    'Week Starting', 'Day', 'Date', 'Start Time', 'End Time',
    'Activity', 'Event ID', 'Request Status', 'Response Date', 'Notes'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setBackground('#4285f4')
    .setFontColor('white')
    .setFontWeight('bold');
}

function clearAndSetupEventsSheet(sheet, weekStartDate) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clear();
  }
  sheet.getRange(2, 1).setValue(weekStartDate);
}

function addEventToEventsSheet(sheet, rowIndex, dayName, timeRange, activity, eventDate, eventId) {
  const startTimeStr = `${timeRange.startHour}:${String(timeRange.startMin).padStart(2, '0')}`;
  const endTimeStr = `${timeRange.endHour}:${String(timeRange.endMin).padStart(2, '0')}`;
  const dateStr = eventDate.toDateString();
  const weekStartDate = sheet.getRange(2, 1).getValue();

  const rowData = [
    weekStartDate,
    dayName,
    dateStr,
    startTimeStr,
    endTimeStr,
    activity,
    eventId,
    'Pending',
    '',
    ''
  ];

  sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Pending', 'Accepted', 'Declined', 'Tentative', 'No Response'])
    .setAllowInvalid(false)
    .build();

  sheet.getRange(rowIndex, 8).setDataValidation(statusRule);
}

function updateAttendanceFromCalendar() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(EVENTS_SHEET_NAME);
  if (!sheet) return;

  const calendar = CalendarApp.getCalendarsByName(CALENDAR_NAME)[0];
  const currentWeek = getCurrentWeekDates();
  const events = calendar.getEvents(
    currentWeek[0],
    new Date(currentWeek[6].getFullYear(), currentWeek[6].getMonth(), currentWeek[6].getDate(), 23, 59, 59)
  );

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 10).getValues();
  const userEmail = Session.getActiveUser().getEmail();

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const eventId = row[6];
    if (!eventId) continue;

    const event = events.find(e => e.getId() === eventId);
    if (!event) continue;

    const guest = event.getGuestList().find(g => g.getEmail() === userEmail);
    if (!guest) continue;

    let newStatus = 'No Response';
    switch (guest.getGuestStatus()) {
      case CalendarApp.GuestStatus.YES: newStatus = 'Accepted'; break;
      case CalendarApp.GuestStatus.NO: newStatus = 'Declined'; break;
      case CalendarApp.GuestStatus.MAYBE: newStatus = 'Tentative'; break;
      case CalendarApp.GuestStatus.INVITED: newStatus = 'Pending'; break;
    }

    const rowIndex = i + 2;
    const statusCell = sheet.getRange(rowIndex, 8);
    const responseDateCell = sheet.getRange(rowIndex, 9);
    const notesCell = sheet.getRange(rowIndex, 10);
    const rowRange = sheet.getRange(rowIndex, 1, 1, 10);

    if (newStatus !== row[7]) {
      statusCell.setValue(newStatus);
      responseDateCell.setValue(new Date());
    }

    if (newStatus === 'Declined') {
      const existingNote = row[9] ? row[9].toString().trim() : '';
      if (!existingNote || existingNote === '(Declined – no reason provided)') {
        notesCell.setValue('(Declined – no reason provided)');
      }
      rowRange.setBackground('#f8d7da'); // red
    } else if (newStatus === 'Accepted') {
      rowRange.setBackground('#d4edda'); // green
    } else {
      rowRange.setBackground(null); // clear
    }
  }

  // Log instead of UI alert
  Logger.log('Attendance updated automatically.');
}


function onEditSchedule(e) {
  if (!e || !e.source || !e.range) return;
  const sheet = e.source.getActiveSheet();
  if (sheet.getName() !== SHEET_NAME) return;

  const editedRange = e.range;
  const row = editedRange.getRow();
  const col = editedRange.getColumn();
  if (row < 2) return; // skip header

  const calendar = CalendarApp.getCalendarsByName(CALENDAR_NAME)[0];
  if (!calendar) return;

  const weekDates = getCurrentWeekDates();
  const eventsSheet = createOrGetEventsSheet();
  const data = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

  const startTimeStr = data[0];
  const endTimeStr = data[1];
  const timeRange = parseTimeRange(startTimeStr.toString(), endTimeStr.toString());
  if (!timeRange) return;

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const colToDay = {
    3: 'Monday',
    4: 'Tuesday',
    5: 'Wednesday',
    6: 'Thursday',
    7: 'Friday',
    10: 'Saturday',
    11: 'Sunday'
  };

  const dayName = colToDay[col];
  if (!dayName) return;

  const dayIndex = dayNames.indexOf(dayName);
  const activity = data[col - 1];
  if (!activity || activity.toString().toLowerCase().includes('lunch')) return;

  const eventDate = weekDates[dayIndex];
  const startDateTime = new Date(eventDate);
  startDateTime.setHours(timeRange.startHour, timeRange.startMin, 0, 0);
  const endDateTime = new Date(eventDate);
  endDateTime.setHours(timeRange.endHour, timeRange.endMin, 0, 0);

  const events = calendar.getEvents(startDateTime, endDateTime);
  let targetEvent = null;

  for (let event of events) {
    if (event.getTitle().includes(dayName) && event.getTitle().includes('-')) {
      targetEvent = event;
      break;
    }
  }

  if (targetEvent) {
    // Update existing event
    targetEvent.setTitle(`${activity} - ${dayName}`);
    targetEvent.setDescription(`Study Session: ${activity}\nDay: ${dayName}`);
    targetEvent.setTime(startDateTime, endDateTime);
    targetEvent.removeAllReminders();
    targetEvent.addPopupReminder(5);
    targetEvent.addEmailReminder(5);
  } else {
    // If no matching event, create a new one
    const newEvent = calendar.createEvent(`${activity} - ${dayName}`, startDateTime, endDateTime, {
      description: `Study Session: ${activity}\nDay: ${dayName}`
    });
    newEvent.addPopupReminder(5);
    newEvent.addEmailReminder(5);
    targetEvent = newEvent;
  }

    // Update the event in Weekly Events sheet
  const allRows = eventsSheet.getDataRange().getValues();

  for (let i = 1; i < allRows.length; i++) {
    const rowDay = allRows[i][1];
    const rowDateStr = new Date(allRows[i][2]).toDateString();
    const rowActivity = allRows[i][5]?.toString().trim().toLowerCase();
    const matchActivity = activity?.toString().trim().toLowerCase();

    if (
      rowDay === dayName &&
      rowDateStr === eventDate.toDateString() &&
      rowActivity === matchActivity
    ) {
      // Update times and ID
      eventsSheet.getRange(i + 1, 4).setValue(`${timeRange.startHour}:${String(timeRange.startMin).padStart(2, '0')}`);
      eventsSheet.getRange(i + 1, 5).setValue(`${timeRange.endHour}:${String(timeRange.endMin).padStart(2, '0')}`);
      eventsSheet.getRange(i + 1, 6).setValue(activity);
      eventsSheet.getRange(i + 1, 7).setValue(targetEvent.getId());
      eventsSheet.getRange(i + 1, 9).setValue(new Date());

      // Highlight the updated row in orange
      const numCols = eventsSheet.getLastColumn();
      eventsSheet.getRange(i + 1, 1, 1, numCols).setBackground('#f4b400'); // orange color
      break;
    }
}


}

function setupWeeklyTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'createWeeklyEvents' || trigger.getHandlerFunction() === 'updateAttendanceFromCalendar') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('createWeeklyEvents')
    .timeBased()
    .everyWeeks(1)
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(8)
    .create();

  ScriptApp.newTrigger('updateAttendanceFromCalendar')
    .timeBased()
    .everyDays(1)
    .atHour(18)
    .create();

  SpreadsheetApp.getUi().alert('Weekly triggers set!\n• Create events: Monday 8 AM\n• Update attendance: Daily 6 PM');
}