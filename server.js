const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes/challenges');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Hacxie CTF Lab running at http://localhost:${PORT}`);
});
