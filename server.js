const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

// Importing database and route files
const db = require('./backend/db');
const loginRouter = require('./backend/login');
const registerRouter = require('./backend/register');
const s1Routes = require('./backend/s1');
const s2Routes = require('./backend/s2');
const AiRoutes = require('./backend/aiidea');
const profileRoutes = require('./backend/profile');

const app = express();
const port = 3000;

// ✅ Middleware to parse JSON request bodies
app.use(bodyParser.json());

// ✅ Middleware to handle user sessions
app.use(session({
  secret: 'a9a6fbf5c9fa12a47bdfb33b7a91157b', // Change this to a unique secret
  resave: false,
  saveUninitialized: true,
}));

// ✅ Serve static files (CSS, images, JavaScript)
app.use('/csspages', express.static(path.join(__dirname, 'frontend', 'csspages')));
app.use('/assets', express.static(path.join(__dirname, 'frontend', 'assets')));

// ✅ Serve all HTML files properly from the 'htmlpages' directory
app.use(express.static(path.join(__dirname, 'frontend', 'htmlpages')));

// ✅ Logging middleware for debugging incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ✅ Direct routes for login and register pages
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'htmlpages', 'login.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'htmlpages', 'register.html'));
});

// ✅ Home page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'htmlpages', 'home.html'));
});

// ✅ Protected route for the intro page (only accessible if logged in)
app.get('/intro.html', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login.html'); // Redirect to login if not logged in
  }
  res.sendFile(path.join(__dirname, 'frontend', 'htmlpages', 'intro.html'));
});

// ✅ API route to check session user
app.get('/session-user', (req, res) => {
  if (req.session.username) {
    res.json({ username: req.session.username });
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

// ✅ Another API route to get username from session
app.get('/getUsername', (req, res) => {
  if (req.session.username) {
    return res.json({ username: req.session.username });
  }
  return res.status(401).json({ error: 'User not logged in' });
});

// ✅ Serve the s1.html file
app.get('/s1.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'htmlpages', 's1.html'));
});

app.get('/s2.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'htmlpages', 's2.html'));
});

app.get('/aiidea.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'htmlpages', 'aiidea.html'));
});

app.get('/profile.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'htmlpages', 'profile.html'));
});

// ✅ Route requests starting with /s1 to be handled in s1.js
app.use('/s1', s1Routes);

// ✅ Route requests starting with /s2 to be handled in s2.js
app.use('/s2', s2Routes);

// ✅ AI Idea route for ChatGPT search
app.use('/aiidea', AiRoutes);

// ✅ Profile routes
app.use('/profile', profileRoutes);

// ✅ Use routers for login & register API requests
app.use('/login', loginRouter);
app.use('/register', registerRouter);

// ✅ Start the Express server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
