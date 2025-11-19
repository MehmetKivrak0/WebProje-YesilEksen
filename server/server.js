// Server başlatma dosyası
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { timeStamp } = require('console');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
    // Bu yarar aynı domainden gelen istekleri kabul etmek için
}));

app.use(morgan('dev')); // Geliştirme için loglama
app.use(express.json()); // şu işe yarar: body parse etmek için
app.use(express.urlencoded({ extended: true }));
// şu işe yarar: form verilerini parse etmek için

//Routes bu işe yarar:
//  API'ların çalışması için bağlantı noktalarını oluşturmak için
app.use('/api/auth', require('./src/routes/authRoutes.js'));
app.use('/api/ciftlik', require('./src/routes/ciftlikRoutes.js'));
app.use('/api/firma', require('./src/routes/firmaRoutes.js'));

//HEALTH CHECK şuna yarar: 
// API'ların çalışmasını kontrol etmek için
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timeStamp: new Date().toISOString(),
        database: 'connected'
    });
});

//Error Handling

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Sunucu hatası',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

//404 handler şuna yarar:
// Endpoint bulunamadığında 404 hatası döndürmek için
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint bulunamadı'
    });
});

//Server başlatma şuna yarar:
// Server'ı başlatmak için

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda çalışıyor`);
    console.log(`📍 API: http://localhost:${PORT}/api`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
});

const pool = new Pool({
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   database: process.env.DB_NAME,
   user : process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   max: 20,
   idleTimeoutMillis: 30000, // Bu işe yarar:
   connectionTimeoutMillis: 2000,
  
});

pool.on('connet',()=>{
    console.log('🔗 PostgreSQL bağlantısı başarılı');
});

pool.on('error',(err)=>{
    console.error('🚨 PostgreSQL hatası:', err);
    process.exit(-1); 
    // Bu işe yarar: -1 ile sistemden çıkış yapılır
});
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('🔍 Query:', { text, duration: `${duration}ms`, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('❌ Query hatası:', error);
        throw error;
    }
};

module.exports = {pool,query};