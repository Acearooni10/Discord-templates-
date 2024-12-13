const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Store templates in a JSON file
const templatesFile = path.join(__dirname, 'templates.json');

// Load existing templates
let templates = [];
if (fs.existsSync(templatesFile)) {
  templates = JSON.parse(fs.readFileSync(templatesFile, 'utf-8'));
}

// Endpoint to upload template
app.post('/upload-template', (req, res) => {
  const { name, description, link } = req.body;

  if (!name || !description || !link) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const newTemplate = { name, description, link };
  templates.push(newTemplate);

  // Save the updated templates to the file
  fs.writeFileSync(templatesFile, JSON.stringify(templates, null, 2), 'utf-8');

  return res.status(200).json({ success: true });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
