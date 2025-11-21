# Postman Test Dokümantasyonu

## API Base URL
```
http://localhost:5000/api
```

## Ön Hazırlık

1. **Server'ı başlatın:**
   ```bash
   cd server
   node server.js
   ```

2. **Health Check:**
   - Method: `GET`
   - URL: `http://localhost:5000/api/health`
   - Response beklenen:
     ```json
     {
       "status": "ok",
       "timeStamp": "2024-01-01T00:00:00.000Z",
       "database": "connected"
     }
     ```

---

## 1. LOGIN (Giriş)

### Endpoint
```
POST http://localhost:5000/api/auth/login
```

### Headers
```
Content-Type: application/json
```

### Request Body (JSON)
```json
{
  "email": "test@example.com",
  "password": "test123"
}
```

### Örnek Başarılı Response (200 OK)
```json
{
  "success": true,
  "message": "Giriş başarılı",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "ad": "Ahmet",
    "soyad": "Yılmaz",
    "eposta": "test@example.com",
    "telefon": "5551234567",
    "rol": "ciftci",
    "durum": "aktif"
  }
}
```

### Hata Durumları

#### 400 Bad Request - Eksik Alanlar
```json
{
  "success": false,
  "message": "Email ve şifre gerekli"
}
```

#### 401 Unauthorized - Yanlış Bilgiler
```json
{
  "success": false,
  "message": "Email veya şifre hatalı"
}
```

#### 403 Forbidden - Hesap Onay Bekliyor
```json
{
  "success": false,
  "message": "Hesabınız admin onayı bekliyor"
}
```

#### 403 Forbidden - Hesap Pasif
```json
{
  "success": false,
  "message": "Hesabınız pasif durumda"
}
```

---

## 2. REGISTER (Kayıt)

### Endpoint
```
POST http://localhost:5000/api/auth/register
```

### Not
Register endpoint'i FormData kabul eder (dosya yükleme için), ancak Postman'de JSON ile de test edebilirsiniz. Dosya yükleme olmadan temel kayıt işlemi yapılabilir.

### Seçenek 1: JSON ile Kayıt (Dosya Olmadan)

#### Headers
```
Content-Type: application/json
```

#### Request Body (JSON) - Çiftçi Kaydı
```json
{
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "password": "test123456",
  "userType": "farmer",
  "phone": "5551234567",
  "terms": true,
  "farmName": "Ahmet'in Çiftliği",
  "address": "Ankara, Türkiye",
  "wasteTypes": ["organik", "hayvansal"]
}
```

#### Request Body (JSON) - Firma Kaydı
```json
{
  "firstName": "Mehmet",
  "lastName": "Demir",
  "email": "mehmet@example.com",
  "password": "test123456",
  "userType": "company",
  "phone": "5559876543",
  "terms": true,
  "companyName": "Demir Gıda A.Ş.",
  "taxNumber": "1234567890",
  "address": "İstanbul, Türkiye"
}
```

#### Request Body (JSON) - Ziraat Odası Yöneticisi
```json
{
  "firstName": "Ali",
  "lastName": "Kaya",
  "email": "ali@example.com",
  "password": "test123456",
  "userType": "ziraat",
  "phone": "5551112233",
  "terms": true
}
```

#### Request Body (JSON) - Sanayi Odası Yöneticisi
```json
{
  "firstName": "Veli",
  "lastName": "Şahin",
  "email": "veli@example.com",
  "password": "test123456",
  "userType": "sanayi",
  "phone": "5554445566",
  "terms": true
}
```

### Seçenek 2: FormData ile Kayıt (Dosya Yükleme ile)

#### Headers
```
Content-Type: multipart/form-data
```
*(Postman otomatik olarak ayarlar)*

#### Body (form-data)
- `firstName`: Ahmet
- `lastName`: Yılmaz
- `email`: ahmet@example.com
- `password`: test123456
- `userType`: farmer
- `phone`: 5551234567
- `terms`: true
- `farmName`: Ahmet'in Çiftliği
- `address`: Ankara, Türkiye
- `wasteTypes`: ["organik", "hayvansal"] (JSON string olarak)
- `tapuOrKiraDocument`: (file) - Tapu veya Kira Belgesi
- `nufusCuzdani`: (file) - Nüfus Cüzdanı
- `ciftciKutuguKaydi`: (file) - Çiftçi Kütüğü Kaydı
- `muvafakatname`: (file) - Muvafakatname
- `taahhutname`: (file) - Taahhütname
- `donerSermayeMakbuz`: (file) - Döner Sermaye Makbuzu

### Örnek Başarılı Response (201 Created)
```json
{
  "success": true,
  "message": "Kayıt başarılı! Admin onayı bekleniyor.",
  "user": {
    "id": 1,
    "ad": "Ahmet",
    "soyad": "Yılmaz",
    "eposta": "ahmet@example.com",
    "rol": "ciftci",
    "durum": "beklemede"
  }
}
```

### Hata Durumları

#### 400 Bad Request - Eksik Alanlar
```json
{
  "success": false,
  "message": "Tüm alanları doldurunuz"
}
```

#### 400 Bad Request - Şartlar Kabul Edilmedi
```json
{
  "success": false,
  "message": "Şartları kabul etmelisiniz"
}
```

#### 400 Bad Request - Email Zaten Kayıtlı
```json
{
  "success": false,
  "message": "Bu email adresi zaten kayıtlı"
}
```

#### 400 Bad Request - Geçersiz Kullanıcı Tipi
```json
{
  "success": false,
  "message": "Geçersiz kullanıcı tipi. Seçenekler: farmer, company, sanayi, ziraat"
}
```

---

## 3. GET ME (Kullanıcı Bilgisi)

### Endpoint
```
GET http://localhost:5000/api/auth/me
```

### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Örnek Başarılı Response (200 OK)
```json
{
  "success": true,
  "user": {
    "id": 1,
    "ad": "Ahmet",
    "soyad": "Yılmaz",
    "eposta": "ahmet@example.com",
    "telefon": "5551234567",
    "rol": "ciftci",
    "durum": "aktif",
    "olusturma_tarihi": "2024-01-01T00:00:00.000Z",
    "son_giris": "2024-01-01T12:00:00.000Z"
  }
}
```

---

## 4. LOGOUT (Çıkış)

### Endpoint
```
POST http://localhost:5000/api/auth/logout
```

### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Örnek Başarılı Response (200 OK)
```json
{
  "success": true,
  "message": "Çıkış başarılı"
}
```

---

## Kullanıcı Tipleri (userType)

- `farmer` veya `ciftci` → Rol: `ciftci`
- `company` veya `firma` → Rol: `firma`
- `ziraat` veya `ziraat_odasi` → Rol: `ziraat_yoneticisi`
- `sanayi` veya `sanayi_odasi` → Rol: `sanayi_yoneticisi`

## Kullanıcı Durumları (durum)

- `beklemede` - Admin onayı bekliyor
- `aktif` - Hesap aktif, giriş yapılabilir
- `pasif` - Hesap pasif, giriş yapılamaz

---

## Postman Collection Örnekleri

### 1. Login Request
```
POST http://localhost:5000/api/auth/login
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "email": "test@example.com",
  "password": "test123"
}
```

### 2. Register Request (Çiftçi)
```
POST http://localhost:5000/api/auth/register
Headers:
  Content-Type: application/json
Body (raw JSON):
{
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "email": "ahmet@example.com",
  "password": "test123456",
  "userType": "farmer",
  "phone": "5551234567",
  "terms": true,
  "farmName": "Ahmet'in Çiftliği",
  "address": "Ankara, Türkiye",
  "wasteTypes": ["organik", "hayvansal"]
}
```

### 3. Get Me Request
```
GET http://localhost:5000/api/auth/me
Headers:
  Authorization: Bearer {login'den dönen token}
  Content-Type: application/json
```

---

## Test Senaryoları

### Senaryo 1: Başarılı Giriş
1. Önce bir kullanıcı kaydedin (Register)
2. Admin onayı verin (veritabanında `durum = 'aktif'` yapın)
3. Login endpoint'ini test edin

### Senaryo 2: Hatalı Şifre
1. Login endpoint'ine yanlış şifre gönderin
2. 401 Unauthorized hatası almalısınız

### Senaryo 3: Kayıt Olmadan Giriş
1. Kayıt olmadan login deneyin
2. 401 Unauthorized hatası almalısınız

### Senaryo 4: Eksik Alanlarla Kayıt
1. Register endpoint'ine eksik alanlarla istek gönderin
2. 400 Bad Request hatası almalısınız

### Senaryo 5: Aynı Email ile Tekrar Kayıt
1. Aynı email ile iki kez kayıt olmayı deneyin
2. İkinci denemede 400 Bad Request hatası almalısınız

---

## Notlar

1. **Token Kullanımı:** Login'den dönen `token` değerini diğer isteklerde `Authorization: Bearer {token}` header'ı ile gönderin.

2. **Dosya Yükleme:** Register endpoint'i FormData kabul eder, ancak dosya olmadan da çalışır. Dosya yükleme test etmek isterseniz Postman'de `form-data` seçeneğini kullanın ve dosya alanlarını `File` tipinde seçin.

3. **Veritabanı:** Test için veritabanında kullanıcı oluşturmanız veya kayıt işlemi yapmanız gerekir. Admin onayı için veritabanında `kullanicilar` tablosunda `durum` alanını `'aktif'` yapmanız gerekebilir.

4. **CORS:** Server CORS ayarları `http://localhost:5173` için yapılmış. Postman'de CORS sorunu yaşamazsınız çünkü Postman bir browser değil.


