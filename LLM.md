# System & Project Context Summary
## System Information
- **Operating System**: macOS
- **Default Shell**: /bin/zsh

## Project Technology Stack
- **Framework**: Svelte / SvelteKit
- **Primary Language**: TypeScript
- **Database**: SQLite (via the official WASM/JS build)
- **Deployment Target**: Progressive Web App (PWA)

## Key Project Constraints & Requirements
1.  **100% Offline Functionality**: The PWA must be fully functional without an internet connection. All features must work offline.
2.  **Client-Side Database**: The application uses a WASM build of SQLite for all data storage. There is no server-side database.
3.  **Persistent Storage**: Data must be stored persistently on the client-side for offline access. The primary storage mechanism for the SQLite database file is the **Origin Private File System (OPFS)**.
4.  **Secure Context Required**: The application must be served over **HTTPS** (even in local development) to enable modern web APIs required for the project, including OPFS and Service Workers.
5.  **Target Platforms**: The PWA is intended to be used on both mobile devices and desktop browsers.
6.  **No User Downloads**: The end-user should not be required to manually download or install any components, including SQLite. The SQLite WASM module must be bundled as part of the web application's static assets.

## Features
1.	Time tracking. This includes adding new entries, updating new entries such as changing activity name, tag, projects. Deleting time entries.
2.	Task management. Features which keep the user on track to help them achieve their goals before a deadline. This means the following will be implemented: Streak tracking, todo list.
3.	Calendar view. The application will now have a calendar view alongside time tracking, similar to TogglTrack (TT) and Clockify.
