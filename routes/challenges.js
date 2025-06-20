const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Challenge 1: Admin Panel
router.get('/admin-hidden-login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

router.post('/admin-hidden-login', express.urlencoded({ extended: true }), (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'h4cxie_rulez') {
    res.send('<h2>Welcome admin! 🎉<br>Flag: hacxie{admin_panel_0wn3d}</h2>');
  } else {
    res.send('<p>Invalid credentials</p>');
  }
});

// Challenge 2: SQLi (Simulated)
router.get('/login-insecure', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.post('/login-insecure', express.urlencoded({ extended: true }), (req, res) => {
  const { username, password } = req.body;
  if (password === "' OR '1'='1") {
    res.send('Welcome! Flag: hacxie{sql_logged_in}');
  } else {
    res.send('Invalid login');
  }
});

// Challenge 3: JWT Tampering
router.get('/jwt-dashboard', (req, res) => {
  res.send('<p>Token accepted: user=admin <br>Flag: hacxie{jwt_token_pwn3d}</p>');
});

// Challenge 4: XSS
router.get('/search', (req, res) => {
  const q = req.query.query || '';
  res.send(`<p>Results for: ${q}</p>`);
});

// Challenge 5: IDOR
router.get('/user/:id', (req, res) => {
  if (req.params.id === '100') {
    res.send('<h3>Welcome User 100! Flag: hacxie{user_privacy_fail}</h3>');
  } else {
    res.send('<h3>User not found or no access</h3>');
  }
});

module.exports = router;

const path = require('path');
let scoreboard = [];

const validFlags = {
  "hacxie{admin_panel_0wn3d}": 20,
  "hacxie{sql_logged_in}": 20,
  "hacxie{jwt_token_pwn3d}": 20,
  "hacxie{xss_alert_1337}": 20,
  "hacxie{user_privacy_fail}": 20
};

router.get('/scoreboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/scoreboard/index.html'));
});

router.post('/submit-flag', express.json(), (req, res) => {
  const { name, flag } = req.body;
  if (!name || !flag) return res.json({ message: 'Missing name or flag' });

  const score = validFlags[flag];
  if (!score) return res.json({ message: 'Invalid flag!' });

  const user = scoreboard.find(s => s.name === name);
  if (user) {
    if (user.flags.includes(flag)) {
      return res.json({ message: 'Flag already submitted!' });
    }
    user.score += score;
    user.flags.push(flag);
  } else {
    scoreboard.push({ name, score, flags: [flag] });
  }

  res.json({ message: 'Flag accepted!' });
});

router.get('/scores', (req, res) => {
  const result = scoreboard.map(({ name, score }) => ({ name, score }));
  res.json(result.sort((a, b) => b.score - a.score));
});

const fs = require('fs');
const { Parser } = require('json2csv');

router.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

router.post('/reset-scores', (req, res) => {
  scoreboard = [];
  res.json({ message: 'Scoreboard reset successfully!' });
});

router.get('/export-scores', (req, res) => {
  const fields = ['name', 'score'];
  const parser = new Parser({ fields });
  const csv = parser.parse(scoreboard.map(({ name, score }) => ({ name, score })));
  res.header('Content-Type', 'text/csv');
  res.attachment('hacxie_scoreboard.csv');
  res.send(csv);
});

router.get('/rce-lab', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/rce_lab.html'));
});

router.post('/rce-lab', express.urlencoded({ extended: true }), (req, res) => {
  const input = req.body.input;
  if (input.includes("ping 127.0.0.1")) {
    res.send("RCE detected. Flag: hacxie{rce_executed}");
  } else {
    res.send("Command not executed.");
  }
});

router.get('/csrf-lab', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/csrf_lab.html'));
});

router.post('/csrf-lab', express.urlencoded({ extended: true }), (req, res) => {
  res.send("CSRF simulation complete. Flag: hacxie{csrf_simulated}");
});

router.get('/ssrf-lab', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/ssrf_lab.html'));
});

router.post('/ssrf-lab', express.urlencoded({ extended: true }), (req, res) => {
  const input = req.body.input;
  if (input.includes("localhost")) {
    res.send("SSRF detected. Flag: hacxie{ssrf_detected}");
  } else {
    res.send("Request failed.");
  }
});
