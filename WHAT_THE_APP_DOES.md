# What This App Does

This is a personal calendar app that shows all your events from Google Calendar and Outlook Calendar in one place. It runs in a web browser on your computer.

---

## Getting Started

When you first open the app (go to **localhost:3000** in Chrome), you'll see a sign-in screen with two big buttons:

- **Sign in with Google** — Use this if your calendar is on Google (Gmail, Google Workspace). You'll be taken to Google's sign-in page. After you sign in and give the app permission to see your calendar, you'll be brought back to the app.

- **Sign in with Microsoft** — Use this if your calendar is on Outlook, Hotmail, or a work/school Microsoft account. Same idea — sign in with Microsoft, give permission, and you're back in the app.

You only need to sign in once. The app remembers you after that.

---

## The Main Screen

After signing in, you land on the **Week View**. Here's what you'll see:

### Left Sidebar (the dark strip on the left)

This is your navigation. It has five buttons:

- **Week** — Shows 7 days side by side with all your events in a time grid (this is the default view)
- **Day** — Shows just one day at a time, with a detailed hour-by-hour view
- **Month** — Shows the whole month as a grid, like a wall calendar, with small event previews in each day
- **Agenda** — Shows a simple scrolling list of all your upcoming events for the next 30 days
- **Settings** — Where you change your preferences (see below)

On a phone, this sidebar moves to the bottom of the screen as a tab bar.

You can collapse the sidebar on a computer by clicking the blue **C** logo — it shrinks to just icons to give you more room.

### Top Bar

Across the top you'll see:

- **The view name** (like "Week") and the current month/year
- **Left arrow, "Today" button, Right arrow** — These let you go back a week, jump to today, or go forward a week. In Day view they move one day at a time, and in Month view they move one month at a time.
- **Checkmark icon** (right side) — This opens and closes the Task Sidebar (see below)
- **Green dot + "Synced"** — This shows the app is connected and working

### Quick Add Bar

Right below the top bar, there's a text box that says **"Quick add: Lunch with Sarah tomorrow at noon"**. This is for creating events by typing in plain English. For example:

- Type "Team meeting Friday at 2pm" and press Enter
- Type "Dentist appointment April 15 at 10am" and press Enter

The app will figure out the date, time, and title from what you type. You'll see a preview of what it understood before you press Enter or click "Add".

---

## The Four Calendar Views

### Week View
- Shows Sunday through Saturday in columns
- Each hour of the day is a row
- Your events appear as colored blocks in the right time slot
- A **red line** shows the current time so you can see where you are in the day
- **Weather** — Each day column header shows a weather emoji and temperature for that day
- **Ideal Week blocks** — If you've set up "ideal week" time blocks (like "Deep Work 9-12"), they appear as faint colored backgrounds behind your events
- **Drag to reschedule** — You can press and drag an event block up or down to move it to a different time. It snaps to 15-minute increments.
- Click any event to see its details in a slide-out panel

### Day View
- Same as Week View but shows just one day, so you get a wider, more detailed look
- Also shows weather and the current time line
- Same drag-to-reschedule feature

### Month View
- Shows the whole month as a grid
- Each day cell shows up to 3 event titles. If there are more, it shows "+2 more" (or however many)
- On a phone, events show as small colored dots instead of titles (to save space)
- Click any day to jump to it

### Agenda View
- A simple scrolling list of everything coming up in the next 30 days
- Events are grouped under date headers like "Today", "Tomorrow", "Monday, April 6, 2026"
- Each event shows its title, time, location, and which calendar it came from (Google or Outlook)
- Click any event to see its full details

---

## Event Details Panel

When you click on any event in any view, a panel slides in from the right showing:

- **Event title**
- **Date and time**
- **Location** (if the event has one)
- **Notes**
- **Source** — Whether it came from Google or Outlook
- **Edit button** — Lets you change the title or notes, then save
- **Delete button** — Click once to see "Confirm Delete", click again to actually delete it

On a phone, this panel takes up the full screen.

---

## Task Sidebar

Click the **checkmark icon** in the top-right corner of the top bar to open the Task Sidebar. This slides in from the right and lets you:

- **Add tasks** — Type a task name and press Enter or click "Add"
- **Check off tasks** — Click the checkbox next to a task to mark it done
- **Delete tasks** — Hover over a task and click the trash icon
- Tasks are split into "pending" and "completed" sections

Close it by clicking the X or the checkmark icon again.

---

## Settings

Click **Settings** in the sidebar to change:

- **Theme** — Choose Dark, Light, or System (follows your computer's setting)
- **Default view** — Which view to show when you open the app (Week, Day, Month, or Agenda)
- **Week starts on** — Sunday or Monday
- **Working hours** — Set your start and end time (like 8:00 AM to 6:00 PM)
- **Show weather** — Turn the weather display on or off
- **Show ideal week** — Turn the background time block overlay on or off
- **Sign Out** — Logs you out and takes you back to the sign-in screen

---

## How to Get Your Real Calendar Events Showing Up

Right now, the app is set up and ready to connect to your real Google or Outlook calendar. Here's what needs to happen:

### For Google Calendar

1. Open the app and click **"Sign in with Google"**
2. Sign in with **getslimwithaaron@gmail.com** (this is the only Google account that works right now because the app is in "testing" mode with Google)
3. Google will ask you to grant the app permission to read and write your calendar — click **Allow**
4. After signing in, your Google Calendar events should start appearing in the Week, Day, Month, and Agenda views

**Important:** Only the Google account **getslimwithaaron@gmail.com** can sign in right now. To allow other Google accounts, someone needs to go to the Google Cloud Console and either add more test users or publish the app.

### For Outlook / Microsoft Calendar

1. Open the app and click **"Sign in with Microsoft"**
2. Sign in with any Microsoft account (personal Outlook/Hotmail, or work/school)
3. Microsoft will ask you to grant the app permission to read and write your calendar — click **Accept**
4. Your Outlook events should start appearing alongside any Google events

**Microsoft is open to everyone** — any Microsoft account can sign in, no restrictions.

### If Events Aren't Showing Up

- Make sure you actually have events on your calendar for the current week. The app only shows events for the date range you're looking at.
- Try clicking the **"Today"** button to make sure you're looking at the current week.
- The events come from the cloud, so you need an internet connection.
- If you just signed in for the first time, wait a few seconds for the events to load.

---

## Works on Any Device

The app adjusts itself to fit whatever screen you're using:

- **Phone** — The sidebar becomes a tab bar at the bottom. Everything is sized for touch.
- **Tablet** — Similar to the phone layout but with more room for content.
- **Laptop / Desktop** — Full sidebar on the left, all features visible.
- **42-inch touch screen** — Larger text and touch targets, designed for a portrait-oriented display.
- **Landscape or portrait** — Works in either orientation automatically.

---

## Installing as an App (Optional)

You can install this as a standalone app so it has its own window (no browser toolbar):

1. Open **localhost:3000** in Chrome
2. Click the install icon in Chrome's address bar (or go to Chrome menu > "Install Calendar")
3. It will open in its own window like a regular app
4. Press **F11** to go fullscreen if you want
