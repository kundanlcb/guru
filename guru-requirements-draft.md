# Guru Teacher Mobile App Requirements (Sanchalan Companion) - Draft v0.2

## 0. Product Name
- Teacher app name: `guru`
- Student/Parent app name: `gurukul`

## 1. Objective
Build `guru`, a React Native app for `Teacher` users that is a mobile companion of Sanchalan, focused on daily teaching workflows with intentionally limited scope.

## 2. Inputs Reviewed
- `sanchalan` web app routes, role guards, and teacher permissions:
  - Teacher-access modules: Students, Attendance, Marks, Homework, Notices.
  - Admin-only modules excluded: Academic setup, teacher management, exam config, reports, finance, payroll.
- `gurukul` mobile app architecture and patterns:
  - React Native CLI + TypeScript + React Navigation + React Query.
  - Tokenized theme system, offline-ready query persistence, OTP-first auth flow.

## 3. Scope
- In scope:
  - Dedicated teacher app (Android + iOS).
  - Teacher login/session, dashboard, class/timetable context.
  - Student list + student profile (read-only).
  - Attendance marking and correction.
  - Marks entry for assigned classes/subjects.
  - Homework assignment management.
  - Notices (read/create).
  - Notifications and basic profile/settings.
- Out of scope:
  - Any Admin/Staff management workflows.
  - Fees, payroll, financial reports, payment flows.
  - Admission/student CRUD from teacher app.
  - Exam setup/report generation configuration.

## 4. Primary Persona
- `Teacher`: needs fast mobile operations during class hours for attendance, marks, homework, and communication.

## 5. Product Principles
- Mobile-first speed for class-time tasks.
- Strict role boundaries (teacher cannot access admin-only operations).
- “Same concepts as Sanchalan web” with simplified mobile interactions.
- Reliable in low/unstable networks with retry/offline-safe read flows.

## 6. Feature Requirements

### 6.1 Authentication and Session
- OTP-first login for teacher mobile number.
- Secure token storage and persistent login.
- Refresh token flow and forced logout on invalid session.

### 6.2 Teacher Home Dashboard
- “Today” summary:
  - classes scheduled today
  - pending attendance submissions
  - homework due/assigned count
  - pending marks entry count
- Quick actions:
  - Mark Attendance
  - Enter Marks
  - Assign Homework
  - Create Notice
  - View My Classes

### 6.3 My Timetable and Classes
- Day/week timetable for teacher.
- Class-wise subject periods and room/time details.
- Tap from timetable slot to attendance/marks/homework for that class.

### 6.4 Students (Teacher View)
- Class-filtered student list for assigned classes only.
- Search by name/roll/student ID.
- Student detail view (read-only):
  - profile basics
  - contact basics
  - attendance summary
  - recent homework/marks snapshot (view-only)
- No create/edit/delete student operations.

### 6.5 Attendance Management
- Mark attendance class-wise by date.
- Status support: `Present`, `Absent`, `Late`, `Excused`.
- Bulk submit with optimistic UI and retry on failure.
- Same-day correction window (based on backend policy).
- Attendance history per class and per student.

### 6.6 Marks Entry
- Select class, section, exam term, and subject.
- Grid/list entry for student marks.
- Validation:
  - cannot exceed max marks
  - required values for published save
- Save status indicators (saving/saved/failed).
- Teacher can edit only assigned subject/class combinations.

### 6.7 Homework Management
- Create homework with:
  - class/section
  - subject
  - title + description
  - due date
  - optional attachments
- List, filter, and view previously assigned homework.
- Edit/delete only own homework (if policy allows).

### 6.8 Notices and Communication
- Notice feed with filters (priority, audience, date).
- Notice detail with attachments.
- Create notice targeted to valid audiences (`All`, `Teachers`, `Students`, specific class where supported).
- Read receipts or read counts if backend supports.

### 6.9 Notifications
- Push notifications for:
  - admin announcements
  - mark submission reminders
  - pending tasks
  - urgent notices
- In-app notification center with read/unread state.

### 6.10 Profile and Settings
- Teacher profile summary.
- Language selection (English/Hindi).
- Notification preference toggles.
- Logout and session/device management basics.

## 7. Limited-Functionality Boundary (Mandatory)
The teacher app must not expose or deep-link to:
- Admin dashboards and school setup.
- Teacher directory management.
- Exam configuration and report generation admin workflows.
- Fee management, payroll, receipts, financial analytics.
- Student admission/document verification CRUD.

## 8. Role and Permission Matrix (Mobile)

| Capability | Teacher |
|---|---|
| OTP login/session | Yes |
| Dashboard | Yes |
| My timetable/classes | Yes |
| Student list/detail (assigned classes) | Yes (Read only) |
| Attendance marking | Yes (Create/Update per policy) |
| Marks entry | Yes (Create/Update per policy) |
| Homework management | Yes |
| Notices (read/create) | Yes |
| Finance/payroll/admin setup | No |

## 9. Technical Requirements
- Stack: React Native CLI + TypeScript.
- Navigation: React Navigation (native stack + bottom tabs).
- Data layer: Axios + TanStack React Query.
- Storage:
  - Encrypted storage for auth tokens.
  - AsyncStorage for safe cached data.
- i18n: English and Hindi from day one.
- Theme: centralized design tokens; no hardcoded per-screen color drift.
- Architecture: feature-first module structure consistent with `gurukul`.

## 10. API and Integration Expectations
- Mobile API surface should be teacher-centric under `/api/mobile/v1/teacher/...` (or equivalent stable contract).
- Required domains:
  - auth/session
  - timetable/classes
  - students (assigned scope)
  - attendance
  - marks
  - homework
  - notices
  - notifications
- Backend must enforce assignment-level authorization (not only app-side checks).

## 11. Non-Functional Requirements
- Performance:
  - dashboard interactive in under 2.5s on target mid-range Android.
  - attendance/marks list operations remain responsive for large classes.
- Reliability:
  - graceful retry states for submissions.
  - offline-safe read experience for recently viewed classes.
- Security:
  - no PII in logs.
  - secure token handling + session expiry enforcement.

## 12. MVP Acceptance Criteria by Module
- Auth: teacher can login/logout reliably with OTP and persistent session.
- Dashboard: key pending tasks visible and quick actions navigate correctly.
- Attendance: class attendance can be marked and saved with clear success/failure states.
- Marks: teacher can enter/edit marks for assigned classes/subjects only.
- Homework: teacher can create and view homework; assignment appears in list.
- Notices: teacher can create a notice and view filtered feed/details.
- Permissions: restricted modules are not visible and not accessible via deep links.

## 13. Release Plan
- Release 1 (MVP):
  - Auth/session
  - Dashboard
  - Timetable/classes
  - Students read-only
  - Attendance
  - Marks entry
  - Homework
  - Notices
  - Profile/settings + notifications
- Release 2:
  - richer analytics widgets for teacher performance
  - advanced offline submission queue
  - attachment enhancements and moderation controls

## 14. Locked MVP Decisions
1. App name is `guru` (teacher-only app).
2. Scope is intentionally limited to daily teacher operations.
3. Student management in teacher app is read-only.
4. Admin/finance/payroll/report-config modules are excluded.
5. English + Hindi support is mandatory in MVP.
6. React Native CLI stack is retained (no Expo migration for MVP).
