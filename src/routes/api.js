require('dotenv').config();

const express = require('express');
const axios = require('axios');
const multer = require('multer');
const upload = multer();
const router = express.Router();

const baseAddress = process.env.REK_BASEADDRES;
const apiKey = process.env.REK_APIKEY;

// Get collections
router.get('/collections', async (req, res) => {
    try {
        const response = await axios.get(`${baseAddress}/collection`, {
            headers: { 'x-api-key': apiKey },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Create a new collection
router.post('/collections', async (req, res) => {
    const { collectionId } = req.body;
    try {
        const response = await axios.post(
            `${baseAddress}/collection`,
            { collectionId },
            { headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete a collection
router.delete('/collections', async (req, res) => {
    const { collectionId } = req.query;
    try {
        const response = await axios.delete(`${baseAddress}/collection`, {
            headers: { 'x-api-key': apiKey },
            params: { collectionId },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Add a face to a collection
router.post('/addFace', upload.single('image'), async (req, res) => {
    const { collectionId, name } = req.body;
    const image = req.file.buffer.toString('base64').replace(/^data:image\/\w+;base64,/, '');
    
    try {
        const response = await axios.post(
            `${baseAddress}/indexface`,
            { collectionId, name, image },
            { headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Detect face in a collection
router.post('/detectFace', upload.single('image'), async (req, res) => {
    const { collectionId } = req.body;
    const image = req.file.buffer.toString('base64').replace(/^data:image\/\w+;base64,/, '');
    
    try {
        const response = await axios.post(
            `${baseAddress}/searchfacebyimage`,
            { collectionId, image },
            { headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
