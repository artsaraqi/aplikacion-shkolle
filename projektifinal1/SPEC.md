# StudentHub - Mobile Application Specification

## 1. Project Overview

**Project Name:** StudentHub  
**Type:** Cross-platform Mobile Application (React + Node.js)  
**Core Functionality:** A student companion app for managing personal schedules, tracking grades/absences, and receiving notifications.

## 2. Technology Stack & Choices

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS (mobile-first)
- **Icons:** Lucide React
- **State Management:** React Context + Hooks
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (better-sqlite3)
- **Real-time:** Server-Sent Events for notifications

## 3. Feature List

### Schedule Management
- View weekly class schedule
- Add/edit/delete classes
- Display class time, location, and instructor

### Grades & Absences
- View grades by subject
- Track attendance/absence records
- Add grades with weight and percentage

### Notifications
- In-app notification system
- Real-time updates via SSE
- Mark notifications as read/unread
- Types: assignment due, grade posted, absence warning

## 4. UI/UX Design Direction

- **Visual Style:** Modern, clean Material Design 3 inspired
- **Color Scheme:** Primary blue (#3B82F6), accent purple (#8B5CF6), neutral grays
- **Layout:** Bottom tab navigation (Schedule, Grades, Notifications)
- **Mobile-First:** Large touch targets (44px min), readable typography, responsive layout
