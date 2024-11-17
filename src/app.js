require('dotenv').config();

const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');
const bodyParser = require('body-parser');

const app = express();
// Increase the limit for JSON payloads
app.use(express.json({ limit: '50mb' })); 

// Increase the limit for URL-encoded payloads
app.use(express.urlencoded({ extended: true, limit: '50mb' })); 

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
