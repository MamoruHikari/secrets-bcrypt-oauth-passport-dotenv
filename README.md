# 🔐 Secrets Auth App

Access the live app here: **[Secrets Auth](https://secrets-bcrypt-oauth-passport-dotenv.onrender.com)**

Note: It may take up to **60 seconds to load** as the app is hosted on Render's free tier.

---

## 📜 Description

This is a full-stack authentication app where users can:

- Register and log in with **email/password**
- Log in via **Google OAuth 2.0**
- Submit a **secret message**
- View their secret securely on their private page

It uses **Node.js**, **Express**, **Passport.js**, **PostgreSQL**, and **bcrypt** for hashing passwords. All login credentials, hashed passwords, and secrets are securely stored in a PostgreSQL database

---

## 🛠 Tech Stack

- **Frontend**: EJS templating, HTML/CSS
- **Backend**: Node.js, Express
- **Authentication**: Passport.js (Local + Google OAuth2 Strategy)
- **Security**: Bcrypt (password hashing), Sessions, Dotenv
- **Database**: PostgreSQL (hosted on Neon.tech)
- **Deployment**: Render.com (free tier)

---

## 🚀 Features

- 🔐 Local authentication with email and password
- 🔑 Google OAuth login
- 🧂 Secure password hashing with bcrypt
- 📦 Session management with `express-session`
- 🌿 Environment variables managed with `dotenv`
- 🗄️ PostgreSQL for persistent storage
- ✍️ Users can submit and edit one secret per account
- ⏳ Authenticated-only access to `/secrets` and `/submit`

---

## 📁 Folder Structure

```
secrets-bcrypt-oauth-passport-dotenv/
├── public/
│   └── css/
│       └── style.css
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── home.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── secrets.ejs
│   └── submit.ejs
├── index.js
├── package.json
└── .env (not committed)
```

---

## 🔒 Security Notes

- Passwords are hashed using bcrypt with a salt.
- Sessions are used to keep users authenticated.
- `.env` keeps sensitive credentials out of the codebase.
