const express = require('express');
const router = express.Router();
const {
    getPanelStats,
    getMyProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getPendingOffers,
    getRecentSales,
    getCiftlikProfil,
    updateCiftlikProfil
} = require('../controllers/ciftlikController');
const { auth } = require('../middleware/auth');

// Tüm route'lar authentication gerektirir
router.use(auth);

// Dashboard istatistikleri
router.get('/panel/stats', getPanelStats);

// Bekleyen onaylar (teklifler)
router.get('/panel/pending-offers', getPendingOffers);

// Son satışlar
router.get('/panel/recent-sales', getRecentSales);

// Ürünler
router.get('/urunler', getMyProducts);
router.post('/urunler', addProduct);
router.put('/urunler/:id', updateProduct);
router.delete('/urunler/:id', deleteProduct);

// Çiftlik Profili
router.get('/profil', getCiftlikProfil);
router.put('/profil', updateCiftlikProfil);

module.exports = router;

