# 🔐 Secrets Auth App

## **Deployed Application**

Access the live site here: **[Secrets Auth App](https://secrets-bcrypt-oauth-passport-dotenv.onrender.com)**

Note: It may take up to **60 seconds to load** as the app is hosted on Render's free tier.

---

## 📜 Description

This is a full-stack authentication app where users can:

- Register and log in with **email/password**
- Log in via **Google OAuth 2.0**
- Submit a **secret message**
- View their secret securely on their private page

It uses **Node.js**, **Express**, **Passport.js**, **PostgreSQL**, and **bcrypt** for hashing passwords. Secrets are stored securely in a PostgreSQL database.

---

## 🛠 Tech Stack

- **Frontend**: EJS templating, HTML/CSS
- **Backend**: Node.js, Express
- **Authentication**: Passport.js (Local + Google OAuth2 Strategy)
- **Security**: Bcrypt (password hashing), Sessions, dotenv
- **Database**: PostgreSQL (hosted on Render or Neon.tech)
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

## 📸 Screenshots

Coming soon…

---

## 📁 Folder Structure

```
secrets-bcrypt-oauth-passport-dotenv/
├── public/
├── views/
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

## 🔑 .env Example

Create a `.env` file in the root of your project with the following variables:

```env
PORT=3000
DATABASE_URL=postgresql://your-user:your-password@your-host/your-db-name?sslmode=require
SESSION_SECRET=your_session_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**⚠️ Important:** Never commit your `.env` file to version control!

---

## 🧪 Local Development Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/secrets-bcrypt-oauth-passport-dotenv.git
cd secrets-bcrypt-oauth-passport-dotenv
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your `.env` file (see example above)

### 4. Run the app locally

```bash
node index.js
```

Visit `http://localhost:3000` in your browser.

---

## 🧰 Database Setup

Make sure to create a PostgreSQL database with a table called `users_auth`:

```sql
CREATE TABLE users_auth (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  secret TEXT
);
```

---

## 🌐 Google OAuth Setup

1. Go to [Google Developer Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Navigate to **Credentials** → Create **OAuth client ID**
4. Set application type: **Web application**
5. Add this authorized redirect URI:  
   ```
   https://secrets-bcrypt-oauth-passport-dotenv.onrender.com/auth/google/secrets
   ```
6. Save your **Client ID** and **Client Secret** in `.env`

---

## 📡 Deployment (Render)

1. Push your code to GitHub
2. Go to [Render.com](https://render.com/)
3. Click **New +** → **Web Service**
4. Connect your GitHub repo
5. Set build command:  
   ```
   npm install
   ```
6. Set start command:  
   ```
   node index.js
   ```
7. Add all necessary environment variables in Render’s **Environment tab**
8. Hit **Deploy**

---

## 🔒 Security Notes

- Passwords are hashed using bcrypt with a salt.
- Sessions are used to keep users authenticated.
- `.env` keeps sensitive credentials out of the codebase.
