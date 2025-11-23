const express = require('express');
const router = express.Router();
const { getDocument, getDocumentInfo } = require('../controllers/documentController');
const { auth } = require('../middleware/auth');

// Tüm kullanıcılar belgeleri görüntüleyebilir (authenticated olmalı)
router.use(auth);

// Belge dosyasını getir (indirme veya görüntüleme)
// İki format destekleniyor:
// 1. /api/documents/file/* - Direkt dosya yolu ile (wildcard route)
// 2. /api/documents/:basvuruId/:belgeId - Veritabanı ID'leri ile

// Wildcard route için regex pattern kullan (Express'te /file/* çalışmaz)
router.get(/^\/file\/(.+)$/, getDocument);
router.get('/:basvuruId/:belgeId', getDocument);

// Belge bilgilerini getir
router.get('/info/:basvuruId/:belgeId', getDocumentInfo);

module.exports = router;

