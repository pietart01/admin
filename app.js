var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});

const { executeQuery } = require('./config/database');

const app = express();

app.use('/adminlte', express.static(path.join(__dirname, 'node_modules/admin-lte')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/users', async (req, res) => {
  try {
    const query = 'SELECT id, username, balance, registrationDate FROM user';
    const users = await executeQuery(query);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

app.get('/games', async (req, res) => {
  try {
    const query = 'SELECT DISTINCT gameName FROM gameInfo ORDER BY gameName';
    const games = await executeQuery(query);
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'An error occurred while fetching games' });
  }
});

app.get('/bets', async (req, res) => {
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
    res.json(bets);
  } catch (error) {
    console.error('Error fetching bets:', error);
    res.status(500).json({ error: 'An error occurred while fetching bets' });
  }
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
