const express = require('express');
const moment = require('moment');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser'); // If using older version of Express
const { modalManager } = require('./modalManager');
const { formatDate, parseFormattedDate } = require('./public/js/dateUtils');

dotenv.config({path: '../.env'});


const { executeQuery } = require('./config/database');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.locals.moment = moment;

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

app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies (form submissions)
app.use(express.json());  // Parse JSON bodies
app.use(cookieParser());
app.use(logger('dev'));

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  // This is a simple example. You might want to use a more robust method
  // to determine the language, such as from a URL parameter or user settings.
  res.locals.lang = req.query.lang || 'kr';
  res.locals.translations = require(`./locales/${res.locals.lang}.json`);
  next();
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  const testUserData = `{"id":7,"username":"rebate0","email":"rebate0","passwordHash":"2580","registrationDate":"2024-10-11T03:57:41.000Z","lastLoginDate":null,"isActive":1,"displayName":"rebate0","balance":1000000,"parentUserId":null,"level":0,"pinCode":null,"accountHolder":null,"bankName":null,"accountNumber":null,"lastIpAddress":null,"lastLogin":null,"isGameRestriction":0,"isLocked":0,"chip":10000000}`;
  req.session.user = JSON.parse(testUserData);
  next()
  // if (req.session.isAuthenticated) {
  //   next();
  // } else {
  //   // res.redirect('/login');
  //   //
  //   const testUserData = `{"id":7,"username":"rebate0","email":"rebate0","passwordHash":"2580","registrationDate":"2024-10-11T03:57:41.000Z","lastLoginDate":null,"isActive":1,"displayName":"rebate0","balance":1000000,"parentUserId":null,"level":0,"pinCode":null,"accountHolder":null,"bankName":null,"accountNumber":null,"lastIpAddress":null,"lastLogin":null,"isGameRestriction":0,"isLocked":0,"chip":10000000}`;
  //   req.session.user = JSON.parse(testUserData);
  //   next();
  // }
};

// Login route
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const rows = await executeQuery('SELECT * FROM user WHERE username = ? AND passwordHash = ?', [username, password]);
  if (rows.length === 0) {
    res.render('login', { error: 'Invalid credentials' });
    return;
  }

  req.session.user = rows[0];
  console.log(JSON.stringify(rows[0]));
  console.log('User logged in:', JSON.stringify(req.session.user))
  req.session.isAuthenticated = true;
  res.redirect('/');
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
app.get('/', (req, res) => {
  res.render('layout', {
    title: 'Dashboard',
    contentPath: 'dashboard'
  });
});

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('layout', {
    title: 'dashboard',
    contentPath: 'dashboard',
  });
});

app.get('/settlements', isAuthenticated, (req, res) => {
  res.render('layout', {
    title: 'Settlements',
    contentPath: 'settlements',
    settlements: [],
  });
});

app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(obj) {
      console.log('Response before formatting:', obj);
      return originalJson.call(this, obj);
  }
  next();
});

app.get('/admin/boards', isAuthenticated, async (req, res) => {
  const boards = await executeQuery('SELECT * FROM board ORDER BY createdAt DESC');
  res.render('layout', {
    title: 'Boards',
    contentPath: 'boards',
    boards: boards,
  });
});

app.post('/admin/boards/create', isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // Insert board into database
    const query = `
      INSERT INTO board (title, content, createdAt)
      VALUES (?, ?, NOW())
    `;
    const result = await executeQuery(query, [title, content]);

    if (result.insertId) {
      res.json({
        success: true,
        message: 'Board created successfully',
        boardId: result.insertId
      });
    } else {
      throw new Error('Failed to create board');
    }

  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/admin/boards/delete/:id', isAuthenticated, async (req, res) => {
  try {
    const boardId = req.params.id;
    console.log('boardId:', boardId);
    
    // Delete the board from database
    const query = 'DELETE FROM board WHERE id = ?';
    const result = await executeQuery(query, [boardId]);

    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: 'Board deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }

  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/admin/boards/:id', isAuthenticated, async (req, res) => {
  try {
    const boardId = req.params.id;
    const board = await executeQuery('SELECT * FROM board WHERE id = ?', [boardId]);

    if (board.length > 0) {
      res.json({
        success: true,
        board: board[0]
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/admin/boards/update/:id', isAuthenticated, async (req, res) => {
  try {
    const boardId = req.params.id;
    const { title, content } = req.body;
    const result = await executeQuery('UPDATE board SET title = ?, content = ? WHERE id = ?', [title, content, boardId]);

    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: 'Board updated successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Board not found'
      });
    }
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/user/:id', (req, res) => {
  const userData = {};//fetchUserData(req.params.id); // Assume this fetches user data
  if (userData) {
    res.render('modal-user', {
      openModal: true,
      userData: JSON.stringify(userData)
    });
  } else {
    res.render('modal-user', {
      openModal: false,
      userData: null
    });
  }
});

// session.user.parantUserId
app.get('/users/list', isAuthenticated, async (req, res) => {
  try {
    const { username, startDate, endDate } = req.query;
    const currentUserId = req.session.user.id;

    // Recursive function to fetch all descendants
    async function getDescendants(parentId) {
      // Fetch all immediate children of the current parentId
      let query = `
    SELECT id, username, balance, registrationDate, parentUserId 
    FROM user 
    WHERE parentUserId = ?
    ORDER BY registrationDate DESC
  `;
      const queryParams = [parentId];

      const users = await executeQuery(query, queryParams);
      const result = [];
      let anyMatches = false;

      for (let user of users) {
        user.registrationDate = formatDate(new Date(user.registrationDate));

        // Recursively fetch descendants
        const childResult = await getDescendants(user.id);
        user.children = childResult.users;

        // Determine whether this user matches the filters
        let matchesFilter = true;

        // Apply username filter
        if (username && !user.username.includes(username)) {
          matchesFilter = false;
        }
        // Apply startDate filter
        if (startDate) {
          const parsedStartDate = parseFormattedDate(startDate);
          if (parsedStartDate && new Date(user.registrationDate) < parsedStartDate) {
            matchesFilter = false;
          }
        }
        // Apply endDate filter
        if (endDate) {
          const parsedEndDate = parseFormattedDate(endDate);
          if (parsedEndDate && new Date(user.registrationDate) > parsedEndDate) {
            matchesFilter = false;
          }
        }

        // If user doesn't match the filter but any of its descendants do, include the user
        if (matchesFilter || childResult.anyMatches) {
          result.push(user);
          anyMatches = true;
        }
      }

      return { users: result, anyMatches: anyMatches };
    }


    // Get the entire tree starting from the current user
    const userTreeResult = await getDescendants(currentUserId, username, startDate, endDate);
    const userTree = userTreeResult.users;

    res.render('layout', {
      title: res.locals.translations.user_list,
      contentPath: 'users-list',
      userTree: userTree,
      filters: { username, startDate, endDate }
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

app.get('/users/tree', isAuthenticated, async (req, res) => {
  try {
    const currentUserId = req.session.user.id;

    // Recursive function to fetch all descendants
    async function getDescendants(parentId) {
      const query = `
        SELECT id, username, balance, registrationDate, parentUserId 
        FROM user 
        WHERE parentUserId = ?
      `;
      const users = await executeQuery(query, [parentId]);

      for (let user of users) {
        user.registrationDate = formatDate(new Date(user.registrationDate));
        user.children = await getDescendants(user.id);
      }

      return users;
    }

    // Get the entire tree starting from the current user
    const userTree = await getDescendants(currentUserId);

    res.render('layout', {
      title: res.locals.translations.user_tree,
      contentPath: 'users-tree',
      userTree: userTree
    });
  } catch (error) {
    console.error('Error fetching user tree:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: `An error occurred while fetching the user tree: ${error.message}`,
      error: error
    });
  }
});

// Render the form
app.get('/create-user', (req, res) => {
  res.render('layout', {
    title: '',//res.locals.translations.user_tree,
    contentPath: 'create-user',
  });
  // res.render('create-user', {
  //   prevurl: '', // Example, can be dynamic
  // });
});

app.post('/create-user', async (req, res) => {
  try {
    console.log('User logged in:', JSON.stringify(req.session.user))

    const currentUserId = req.session.user.id;  // Ensure user is authenticated
    const { uid, nic, password, bankinfo, bankcode, bankowner, mm_slot, mm_live } = req.body;

    // Password is already hashed in this example (if hashing is needed, use bcrypt)
    const passwordHash = password;

    // Check for duplicate username or displayName
    const duplicateUsernameQuery = 'SELECT id FROM user WHERE username = ?';
    const duplicateDisplayNameQuery = 'SELECT id FROM user WHERE displayName = ?';
    const usernameExists = await executeQuery(duplicateUsernameQuery, [uid]);
    const displayNameExists = await executeQuery(duplicateDisplayNameQuery, [nic]);

    // If either username or nickname already exists, send error response
    if (usernameExists.length > 0 || displayNameExists.length > 0) {
      return res.status(400).render('error', {
        title: 'Duplicate Entry',
        message: 'Username or Nickname already exists. Please choose another.',
        error: new Error('Duplicate Entry')
      });
    }

    // Insert into user table
    const insertUserQuery = `
      INSERT INTO user (parentUserId, username, displayName, passwordHash, bankName, accountNumber, accountHolder)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await executeQuery(insertUserQuery, [currentUserId, uid, nic, passwordHash, bankinfo, bankcode, bankowner]);

    const newUserId = result.insertId;

    // Insert into userRebateSetting table for 'slot' and 'live' rebates
    const insertSlotRebateQuery = `
      INSERT INTO userRebateSetting (userId, childUserId, rollingRebatePercentage, gameCategoryId)
      VALUES (?, ?, ?, 0)
    `;
    const insertLiveRebateQuery = `
      INSERT INTO userRebateSetting (userId, childUserId, rollingRebatePercentage, gameCategoryId)
      VALUES (?, ?, ?, 1)
    `;

    // Insert rebates for 'slot' and 'live' settings

    console.log('currentUserId:', currentUserId, 'newUserId:', newUserId, 'mm_slot:', mm_slot, 'mm_live:', mm_live);

    await executeQuery(insertSlotRebateQuery, [currentUserId, newUserId, mm_slot]);
    await executeQuery(insertLiveRebateQuery, [currentUserId, newUserId, mm_live]);

    // On success, redirect to the user list page with a success message
    res.redirect('/users/list?success=User successfully created');

  } catch (error) {
    // Handle any errors (database issues, unexpected errors)
    res.status(500).render('error', {
      title: 'Error',
      message: `An error occurred while creating the user: ${error.message}`,
      error: error
    });
  }
});


app.get('/games/slot-history', isAuthenticated, async (req, res) => {
  try {
    const { username, gameName, startDate, endDate } = req.query;
    let query = `
      SELECT u.username, 
             gi.gameName AS game, 
             gi.gameCode,
             gi.gameCategoryId,
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
      const parsedStartDate = parseFormattedDate(startDate);
      if (parsedStartDate) {
        query += ' AND s.createdAt >= ?';
        queryParams.push(parsedStartDate);
      }
    }
    if (endDate) {
      const parsedEndDate = parseFormattedDate(endDate);
      if (parsedEndDate) {
        query += ' AND s.createdAt <= ?';
        queryParams.push(parsedEndDate);
      }
    }

    query += ' ORDER BY s.createdAt DESC LIMIT 100';

    const bets = await executeQuery(query, queryParams);
    const games = await executeQuery('SELECT DISTINCT gameName FROM gameInfo ORDER BY gameName');

    // Format dates for display
    bets.forEach(bet => {
      bet.createdAt = formatDate(new Date(bet.createdAt));
    });

    res.render('layout', {
      title: res.locals.translations.slot_betting_history,
      contentPath: 'slot-history',
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

app.get('/check-duplicate', async (req, res) => {
  const { type, value } = req.query;

  if (!type || !value) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  try {
    let query = '';
    if (type === 'username') {
      query = 'SELECT id FROM user WHERE username = ?';
    } else if (type === 'displayName') {
      query = 'SELECT id FROM user WHERE displayName = ?';
    }

    const results = await executeQuery(query, [value]);

    if (results.length > 0) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
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
