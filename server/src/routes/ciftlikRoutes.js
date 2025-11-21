const express = require('express');
const router = express.Router();

// Geçici route - Çiftçi API'leri için
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'Çiftlik route çalışıyor' });
});

module.exports = router;

