# Cadet Thrust 2.0

An unofficial website of Sylhet Cadet College

## Features

- Clean and Professional Design
- User Authentication with Supabase
- Registration with validation
- Responsive Layout
- TypeScript Support

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase Account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/CadetThrust2.0.git
cd CadetThrust2.0
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local .env.local.example
```

4. Add your Supabase credentials to `.env.local`
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

5. Create database tables in Supabase

Run this SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  account_name TEXT UNIQUE NOT NULL,
  cadet_name TEXT NOT NULL,
  cadet_no TEXT NOT NULL,
  batch TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_account_name ON users(account_name);
CREATE INDEX idx_users_email ON users(email);
```

6. Start development server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Project Structure

```
CadetThrust2.0/
├── src/
│   ├── components/
│   ├── config/
│   │   └── supabase.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Home.tsx
│   │   └── Auth.css
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.local
```

## Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technologies Used

- React 18
- TypeScript
- Vite
- React Router
- Supabase

## License

Private Project
