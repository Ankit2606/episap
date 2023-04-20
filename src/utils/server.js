const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/data', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data.json'));
  res.json(data);
});

app.post('/api/data', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data.json'));
  const newData = req.body;
  data.push(newData);
  fs.writeFileSync('data.json', JSON.stringify(data));
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});