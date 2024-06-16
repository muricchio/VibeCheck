const express = require('express');
const router = express.Router();

const html_dir = __dirname + '/static/';

router.get('/', (req, res) => {
    res.sendFile(html_dir + 'login.html');
});

router.get('/login', (req, res) => {
    res.sendFile(html_dir + 'login.html');
});

router.get('/authenticate', (req, res) => {
    res.sendFile(html_dir + 'spotify_authenticate.html');
});

router.get('/create_account', (req, res) => {
    res.sendFile(html_dir + 'create_account.html');
});

router.get('/dashboard', (req, res) => {
    res.sendFile(html_dir + 'dashboard.html');
});

router.get('/playlist', (req,res) => {
    res.sendFile(html_dir + 'playlist.html');
});

router.get('/tracks', (req,res) => {
    res.sendFile(html_dir + 'tracks.html');
});

router.get('/offline', (req, res) => {
    res.sendFile(html_dir + 'offline.html');
});

router.get('/rankings', (req, res) => {
    res.sendFile(html_dir + 'rankings.html');
});

module.exports = router;
