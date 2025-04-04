import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 15,
    secure: false, 
    httpOnly: true,
    sameSite: "lax"
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/secrets", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.user.id]);
      res.render("secrets.ejs", { secret: user.rows[0].secret});
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit.ejs");
  } else {
    res.redirect("/login");
  }
});

app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

app.get("/auth/google/secrets", passport.authenticate("google", {
  successRedirect: "/secrets",
  failureRedirect: "/login"
}));

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
});

app.post("/submit", async (req, res) => {
  const secret = req.body.secret;
  const id = req.user.id;
  try {
    await pool.query(`UPDATE users SET secret = $1 WHERE id = $2`, [secret, id]);
    res.redirect("/secrets");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    const user = result.rows[0];
    if (user) {
      return res.status(400).send("User already exists");
    } else {
      const hash = await bcrypt.hash(password, saltRounds);
      const newUserResult = await pool.query(`
        INSERT INTO users (email, password)
        VALUES ($1, $2)
        RETURNING *`,
        [email, hash]
      );
      const newUser = newUserResult.rows[0];
      req.login(newUser, (err) => {
        if (err) {
          console.error("Error logging in:", err); 
          return res.status(500).send("Error logging in user");
        }
        res.redirect("/secrets");
      });
    }
  } catch (err) {
      console.error("Error during registration process:", err);
      res.status(500).send("An error occurred during registration. Please try again later.");
  }
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secrets",
  failureRedirect: "/login",
  failureMessage: true
}));

passport.use("local",
  new LocalStrategy(
    async (username, password, done) => {
      try {
        const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [username]);
        const user = result.rows[0];

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const storedHashedPassword = user.password;

        const isMatch = await bcrypt.compare(password, storedHashedPassword);

        if (!isMatch) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
));

passport.use("google",
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (user.rows.length > 0) {
        return done(null, user.rows[0]);
      }
      const newUser = await pool.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *", [email, "google"]);
      done(null, newUser.rows[0]);
    } catch (err) {
      done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = result.rows[0];
    if (!user) return done(null, false);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
