# 🎓 Student Management System

A scalable role-based student management system built with React, Vite, and Tailwind CSS.

## 🚀 Live Demo
[View Live Demo](student-management-system-psi-tawny.vercel.app)

## ✨ Features

### Admin Features
- ✅ View all students in multiple layouts
- ✅ Create, edit, and manage student records
- ✅ Dynamic custom field builder
- ✅ Real-time data synchronization
- ✅ 5 different view types

### Student Features
- ✅ View personal data only
- ✅ Access to all 5 view types
- ✅ Read-only profile management

### Views
1. **Table View** - Classic data grid
2. **Gallery View** - Card-based layout
3. **Kanban View** - Status-based columns
4. **Timeline View** - Chronological display
5. **Calendar View** - Date-based grouping

## 🛠️ Tech Stack

- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Context API** - State Management
- **Custom SWR** - Data Fetching
- **LocalStorage** - Data Persistence

## 📦 Installation
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/student-management-system.git

# Navigate to project
cd student-management-system

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔑 Login Credentials

**Admin Account:**
- Email: `admin@school.com`
- Password: `admin123`

**Student Accounts:**
- Email: `john@student.com` | Password: `john123`
- Email: `emma@student.com` | Password: `emma123`

## 📁 Project Structure
```
src/
├── api/              # API layer for data operations
├── services/         # Business logic services
├── hooks/            # Custom React hooks (SWR, useStudents, etc.)
├── context/          # Context API (Authentication)
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components
│   └── views/       # View components (Table, Gallery, etc.)
├── pages/           # Page components
├── layouts/         # Layout components
└── utils/           # Utility functions
```

## 🎯 Key Concepts

### Custom SWR Implementation
Implements data fetching with caching and automatic revalidation:
```javascript
const { data, isLoading, mutate } = useSWR('students', studentApi.getAll);
```

### Dynamic Form Generation
Custom fields are generated at runtime from schema:
```javascript
<DynamicFormField field={customField} value={value} onChange={handleChange} />
```

### Role-Based Access Control
UI and permissions adapt based on user role:
```javascript
const { user } = useAuth();
if (user.role === 'admin') {
  // Show admin features
}
```

## 🚀 Deployment

Deployed on Netlify with automatic builds from GitHub.

## 📝 Assignment Requirements

✅ React (Latest) with Vite
✅ Tailwind CSS + shadcn/ui components
✅ Context API for state management
✅ Custom SWR implementation
✅ Role-based authentication
✅ LocalStorage persistence
✅ Dynamic custom fields
✅ 5 different view types
✅ Real-time updates across all views
✅ Clean architecture with separation of concerns

## 👨‍💻 Author

Siddharth Chaudhari - [GitHub](https://github.com/siddharth-chaudhari)

## 📄 License

This project is open source and available under the MIT License.