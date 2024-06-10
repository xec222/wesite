const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/save-entry', (req, res) => {
    const entry = req.body.entry;
    const entryFilePath = path.join(__dirname, 'entries', `${Date.now()}.txt`);
    fs.writeFile(entryFilePath, entry, (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Günlük kaydedilemedi.' });
        }
        res.json({ success: true, message: 'Günlük kaydedildi.' });
    });
});

app.get('/get-entries', (req, res) => {
    const entriesDir = path.join(__dirname, 'entries');
    fs.readdir(entriesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Günlükler yüklenemedi.' });
        }
        const entries = [];
        files.forEach(file => {
            const entry = fs.readFileSync(path.join(entriesDir, file), 'utf8');
            entries.push(entry);
        });
        res.json({ success: true, entries });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
