const express = require('express');
const app = express();
const path = require('path');
const port = process.env.port || 4000;
app.use(express.static(path.join('view')))

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/view/about.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname, '/view/index.html');
});

app.listen(port, (req, res) => {
  console.log(`--- server start on port ${port}---`);  
});