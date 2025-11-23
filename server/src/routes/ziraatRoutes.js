const express = require('express');
const router = express.Router();

const {
    getDashboardStats,
    getProductApplications,
    getFarmApplications,
    approveProduct,
    rejectProduct,
    approveFarm,
    rejectFarm,
    getRegisteredFarmers,
    getDashboardProducts,
    getActivityLog,
    getFarmLogs,
    getAllFarmLogs,
    updateDocumentStatus
} = require('../controllers/ziraatController');
const { auth, checkRole } = require('../middleware/auth');
router.use(auth);
router.use(checkRole('ziraat_yoneticisi'));

router.get('/dashboard/stats', getDashboardStats);
router.get('/products/applications', getProductApplications);
router.get('/farms/applications', getFarmApplications);
router.post('/products/approve/:id', approveProduct);
router.post('/products/reject/:id', rejectProduct);
router.post('/farms/approve/:id', approveFarm);
router.post('/farms/reject/:id', rejectFarm);
router.get('/farmers/registered', getRegisteredFarmers);
router.get('/dashboard/products', getDashboardProducts);
router.get('/activity-log', getActivityLog);
router.get('/farms/:id/logs', getFarmLogs);
router.get('/farms/logs/all', getAllFarmLogs);
router.put('/documents/:belgeId', updateDocumentStatus);

module.exports = router;

