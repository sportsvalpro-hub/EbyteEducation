# eByte Education Platform

An AI-powered learning & assessment system combining Udemy courses with intelligent quizzes, exercises, and analytics.

## Features

### Public Pages
- **Home Page**: Hero section with feature overview and CTA
- **About Page**: Platform mission and team information
- **Contact Page**: Contact form and support information

### Authentication
- Login system with role-based access
- Request Access page for new users
- Three user roles: Admin, Management, Student

### Student Features (User Role)
- **Dashboard**: Progress tracking, quick stats, recent activity
- **Courses**: Browse courses with Udemy integration
- **Exercises**: 4 types of practice exercises
  - Multiple Choice (MCQ)
  - Fill in the Blank
  - Match the Following
  - True/False
- **Quizzes**: AI-powered assessments with adaptive difficulty
- **AI Results**: Detailed performance analytics with recommendations
  - Score breakdown
  - Strength/weakness analysis
  - Personalized recommendations
  - AI-generated insights

### Management Features (Management Role)
- **Dashboard**: Overview of users and platform stats
- **Add Users**: Bulk user registration
- **User List**: Search and filter users by status

### Admin Features (Admin Role)
- **Admin Dashboard**: Full system control and stats
- **User Validation**: Approve/reject pending registrations
- **Quiz Builder**: Create and manage quizzes
- **Learning Materials**: Manage PDFs, notes, videos
- **Analytics**: Platform-wide reporting and insights

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Authentication**: Context API (Mock)
- **Fonts**: Geist family

## Demo Credentials

\`\`\`
Admin:     admin@ebyte.edu / password
Manager:   manager@ebyte.edu / password
Student:   student@ebyte.edu / password
\`\`\`

## Role-Based Routes

### Admin Routes
- `/admin/dashboard`
- `/admin/validate-users`
- `/admin/quiz-builder`
- `/admin/learning-materials`
- `/admin/analytics`

### Management Routes
- `/management/dashboard`
- `/management/add-users`
- `/management/user-list`

### Student Routes
- `/dashboard`
- `/courses`
- `/exercises`
- `/quizzes`
- `/results`

### Public Routes
- `/`
- `/about`
- `/contact`
- `/login`
- `/request-access`

## Installation

\`\`\`bash
# Install with shadcn CLI
npx shadcn-cli@latest init
npx shadcn-cli@latest add button card input

# Or download and install manually
npm install
npm run dev
\`\`\`

## Getting Started

1. Login with demo credentials
2. Navigate to role-specific dashboard
3. Explore features based on user role
4. Add mock data as needed

## Architecture

- **Authentication**: Global Auth Context via AuthProvider
- **Authorization**: ProtectedRoute component for role-based access
- **State Management**: React Context API
- **Styling**: Design tokens in globals.css
- **UI Components**: Shadcn/ui library

## Future Enhancements

- Integration with Supabase/PostgreSQL for data persistence
- Real AI integration for quiz evaluation
- Email notifications
- Advanced reporting and data export
- Mobile app support
- Real-time collaboration features
