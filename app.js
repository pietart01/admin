var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const express = require('express');
const path = require('path');

const app = express();

// Dummy data
const users = [
  { id: 1, username: 'john_doe', balance: 1000, registrationDate: '2024-01-15' },
  { id: 2, username: 'jane_smith', balance: 1500, registrationDate: '2024-02-20' },
  { id: 3, username: 'bob_johnson', balance: 750, registrationDate: '2024-03-10' }
];

const bets = [
  { username: 'john_doe', game: 'Slots', payout: 200, betAmount: 100, rollingRate: 0.1, balanceAfterSpin: 1100 },
  { username: 'jane_smith', game: 'Roulette', payout: 0, betAmount: 50, rollingRate: 0.05, balanceAfterSpin: 1450 },
  { username: 'bob_johnson', game: 'Blackjack', payout: 100, betAmount: 100, rollingRate: 0.15, balanceAfterSpin: 850 }
];

// Serve static files from the AdminLTE distribution
app.use('/adminlte', express.static(path.join(__dirname, 'node_modules/admin-lte')));

// Serve your own static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/bets', (req, res) => {
  res.json(bets);
});


module.exports = app;
