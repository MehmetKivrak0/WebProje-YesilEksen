## SDG ve Yapay Zeka Entegrasyonu

### Veri Toplama ve Hazırlık
- PostgreSQL’den su/enerji kullanımı, atık yönetimi, gelir gibi sürdürülebilirlik metriklerini çekip SDG hedefleriyle eşleştir.
- Ölçüm birimlerini normalize et, eksik verileri doldur ya da flagleyip modele bilgi ver; `SDG -> göstergeler` haritası oluştur.
- Metin tabanlı veriler (denetim notları, üretici açıklamaları) için NLP ön işlemleri (tokenization, embedding) hazırla.

### Skorlama ve Tahmin
- SDG bazlı uyum skorları için ML model seti (ör. gradient boosting, neural network) kur; geçmiş performans ve denetim sonuçlarına göre eğit.
- Model çıktısını API ile servis edip her çiftlik/ürün için SDG hedefi bazında puanlanmış sonuç döndür.
- Trend analizi için zaman serisi (ör. ARIMA, Prophet) ile amaç bazlı gelişim grafikleri oluştur.

### AI Destekli Öneriler
- OpenAI/Azure OpenAI gibi LLM servisleriyle skor sonuçlarını prompt’layıp “SDG 6 için iyileştirme önerileri” gibi özetler üret.
- Benzer çiftlik/ürün örneklerini embedding benzerliği ile bulup “en iyi uygulamalar” şeklinde listeler sun.
- Güven için model açıklayıcılığı (ör. SHAP) ya da risk metriğini rapora eklemeyi düşün.

### Raporlama Akışı
- SDG rapor sekmesinde amaç bazlı skor kartları, trend grafikleri, risk seviyeleri ve AI öneri blokları göster.
- PDF/Excel rapor çıktısına AI tarafından oluşturulan özet, öneriler ve kullanılan veri kaynaklarını ekle.
- “AI ile analiz et” butonu ile backend servisinden raporu tetikleyip sonuçları cache’leyerek tekrar kullanımda hız sağla.

### Mimari Notlar
- SDG analizi için ayrı microservice/worker kurgulanabilir; PostgreSQL’den veriyi alıp ML/LLM inference yaptıktan sonra REST/GraphQL ile sonuç döndürür.
- API anahtarlarını `.env` içinde sakla; kullanıcı rolüne göre SDG raporlarına erişim kontrolü uygula.
- Modelleri düzenli periyotlarda yeni verilerle yeniden eğit; raporda “model güncelleme tarihi” bilgisini göster.

