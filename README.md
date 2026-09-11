# Wivly

Connect without exaggeration.

Wivly is a small social platform I built to actually learn Next.js and Redux instead of just reading about them. You can sign up, post updates with photos or video, like and comment on posts, send and accept connection requests, edit a proper profile (bio, experience, education), and even download someone's profile as a PDF resume. Basically a stripped-down LinkedIn/Twitter hybrid, built from scratch.

> The backend is hosted on Render's free tier, which spins down when idle. If you're signing up or logging in and it seems stuck, that's it waking back up — give it up to 30 seconds on the first request.

## Why I built this

I'd used React before, but never Next.js and never Redux for real state management. This project was me picking both up properly — the pages router, layouts, dynamic routes, and then Redux Toolkit for everything shared across the app (auth, posts, connections).

Redux especially took a while to click. The mental model of dispatch → reducer → re-render sounds simple written down, but wiring it correctly across a dozen features (likes, comments, connection requests, profile edits, file uploads) is where it actually sinks in. I read a lot of the official docs for both — the Next.js routing guide and the Redux Toolkit essentials — and rebuilt pieces two or three times before the patterns stopped feeling foreign.

Whole thing took about a month, working around everything else going on. I wrote most of it myself, and some of the later features (the connection request flow, the profile editor, Cloudinary image uploads) with an AI's help — but I didn't treat that as a shortcut past learning it. Afterward I went back through what it wrote, feature by feature, until I could explain the Redux slice, the API route, and the component wiring myself without looking anything up. That second pass is honestly where most of the real learning happened, more than the first draft of any feature.

## Features

- **Auth** — register/login with JWT, passwords hashed with bcrypt, rate-limited login/register endpoints
- **Posts** — create text posts with an optional image or video, like/unlike, comment, delete your own
- **Feed** — chronological, newest first
- **Discover** — browse other users
- **Connections** — send a request, cancel it, accept or decline one you received, see your connections
- **Profiles** — bio, headline, work experience, education, all editable; profile picture upload (Cloudinary); download anyone's profile as a generated PDF resume
- **Top Users** — a sidebar ranking people by number of connections

## Tech stack

**Frontend** — Next.js (pages router), React, Redux Toolkit, React Redux, Axios, CSS Modules

**Backend** — Node.js, Express, MongoDB with Mongoose, JWT for auth, bcrypt for password hashing, Multer + Cloudinary for file uploads, PDFKit for the resume generation, express-rate-limit on auth routes

## Project structure

```
Wivly/
├── frontend/               Next.js app
│   └── src/
│       ├── pages/           routes (pages router)
│       ├── components/      shared UI (PostCard, CommentsModal, EditProfileModal, Navbar)
│       ├── layout/          UserLayout (navbar) and DashboardLayout (sidebar + feed shell)
│       └── config/
│           ├── redux/        store + one slice per feature (auth, posts)
│           ├── client.js     the axios instance every API call goes through
│           └── mediaUrl.js   resolves stored image values to real URLs
└── backend/                 Express API
    ├── controllers/          route handlers
    ├── routes/                endpoint definitions
    ├── models/                Mongoose schemas
    ├── middlewares/           auth, file upload, rate limiting
    └── config/                Cloudinary setup
```

## Running it locally

You'll need Node 18+, a MongoDB connection string, and a Cloudinary account.

**Backend**
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URL, JWT_SECRET, CLOUDINARY_* and CLIENT_URL
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_BACKEND_URL to the backend's address
npm run dev
```

The frontend runs on `http://localhost:3000`, the backend on whatever `PORT` you set (`9090` by default).

## What I'd do differently next time

Pagination on the feed — right now it fetches every post at once, which is fine at this scale and wouldn't be at any real one. And I'd reach for TypeScript from the start; a few of the bugs I hit while building this were exactly the kind a type checker would have caught immediately.

---

Built by [Saim](https://github.com/Saim164).
