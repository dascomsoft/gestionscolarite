# 🏫 School Management - Desktop Application

A complete school management desktop application built with Electron, React, and SQLite.

## ✨ Features

- **Student Management** - Add, edit, and manage students with classes and sections
- **Payment System** - Process tuition payments with receipt generation
- **Receipt Printing** - Generate and print professional PDF receipts
- **Statistics Dashboard** - Real-time insights with charts and reports
- **Advanced Search** - Quick student and payment lookup
- **Data Export** - Export reports and data for backup

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **CSS Modules** - Scoped styling
- **Component Architecture** - Reusable and maintainable

### Backend
- **Electron** - Cross-platform desktop framework
- **SQLite** - Embedded database for local storage
- **IPC Communication** - Secure frontend-backend messaging
- **File System Access** - Local file operations and storage

### Build & Deployment
- **Electron Builder** - Application packaging and distribution
- **GitHub Actions** - CI/CD with automatic Windows builds
- **NSIS Installer** - Professional Windows installation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Development
```bash
# Install dependencies
cd frontend && npm install
cd ../server && npm install

# Run in development mode
# Terminal 1: Start frontend dev server
cd frontend && npm run dev

# Terminal 2: Start Electron app
cd server && npm run dev
