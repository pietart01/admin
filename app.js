const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

dotenv.config({path: '../.env'});

const { executeQuery } = require('./config/database');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve AdminLTE files
app.use('/admin-lte', express.static(path.join(__dirname, 'node_modules/admin-lte'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Login route
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin2580') {
    req.session.isAuthenticated = true;
    res.redirect('/');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
});

// Protected routes
app.get('/', isAuthenticated, (req, res) => {
  res.render('layout', {
    title: 'Dashboard',
    contentPath: 'dashboard'
  });
});

app.get('/users', isAuthenticated, async (req, res) => {
  try {
    const { username, startDate, endDate } = req.query;
    let query = 'SELECT id, username, balance, registrationDate FROM user WHERE 1=1';
    const queryParams = [];

    if (username) {
      query += ' AND username LIKE ?';
      queryParams.push(`%${username}%`);
    }
    if (startDate) {
      query += ' AND registrationDate >= ?';
      queryParams.push(startDate);
    }
    if (endDate) {
      query += ' AND registrationDate <= ?';
      queryParams.push(endDate);
    }

    query += ' ORDER BY registrationDate DESC';

    const users = await executeQuery(query, queryParams);
    res.render('layout', {
      title: 'User List',
      contentPath: 'users',
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: `An error occurred while fetching users: ${error.message}`,
      error: error
    });
  }
});

app.get('/bets', isAuthenticated, async (req, res) => {
  try {
    const { username, gameName, startDate, endDate } = req.query;
    let query = `
      SELECT u.username, 
             gi.gameName AS game, 
             gi.gameCode,
             gi.gameType,
             gi.rtpRate,
             s.payout, 
             s.betAmount, 
             s.rollingRate, 
             s.balanceAfterSpin,
             s.createdAt
      FROM slotSpin s
      JOIN user u ON s.userId = u.id
      JOIN gameInfo gi ON s.gameInfoId = gi.id
      WHERE 1=1
    `;
    const queryParams = [];

    if (username) {
      query += ' AND u.username LIKE ?';
      queryParams.push(`%${username}%`);
    }
    if (gameName) {
      query += ' AND gi.gameName = ?';
      queryParams.push(gameName);
    }
    if (startDate) {
      query += ' AND s.createdAt >= ?';
      queryParams.push(startDate);
    }
    if (endDate) {
      query += ' AND s.createdAt <= ?';
      queryParams.push(endDate);
    }

    query += ' ORDER BY s.createdAt DESC LIMIT 100';

    const bets = await executeQuery(query, queryParams);
    const games = await executeQuery('SELECT DISTINCT gameName FROM gameInfo ORDER BY gameName');
    res.render('layout', {
      title: 'Bet List',
      contentPath: 'bets',
      bets: bets,
      games: games
    });
  } catch (error) {
    console.error('Error fetching bets:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: `An error occurred while fetching bets: ${error.message}`,
      error: error
    });
  }
});

// API routes
app.post('/api/users/:id/issue', isAuthenticated, async (req, res) => {
  const userId = req.params.id;
  const { points } = req.body;

  if (!points || isNaN(points) || points <= 0) {
    return res.status(400).json({ error: 'Invalid points value' });
  }

  try {
    const updateQuery = 'UPDATE user SET balance = balance + ? WHERE id = ?';
    await executeQuery(updateQuery, [points, userId]);

    const userQuery = 'SELECT id, username, balance, registrationDate FROM user WHERE id = ?';
    const updatedUser = await executeQuery(userQuery, [userId]);

    res.json({ message: 'Points issued successfully', user: updatedUser[0] });
  } catch (error) {
    console.error('Error issuing points:', error);
    res.status(500).json({ error: 'An error occurred while issuing points' });
  }
});

// Error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('layout', {
    title: 'Error',
    contentPath: 'error',
    message: 'Something broke!',
    error: err
  });
});

module.exports = app;