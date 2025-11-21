import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

function Giris() {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // "Beni hatırla" için localStorage'dan email'i yükle
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }
  }, []);

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Debug: Giriş denemesi
      console.log('🔐 Giriş denemesi:', {
        email: formData.email,
        hasPassword: !!formData.password,
        passwordLength: formData.password?.length
      });

      const response = await authService.login({
        email: formData.email,
        password: formData.password
      });
      const user = response.user;
      
      // "Beni hatırla" seçili ise email'i kaydet, değilse sil
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Rol bazlı yönlendirme
      switch (user.rol) {
        case 'firma':
          navigate('/firma/panel');
          break;
        case 'ciftci':
          navigate('/ciftlik/panel');
          break;
        case 'ziraat_yoneticisi':
          navigate('/admin/ziraat');
          break;
        case 'sanayi_yoneticisi':
          navigate('/admin/sanayi');
          break;
        case 'super_yonetici':
          // Super yönetici için varsayılan olarak ziraat dashboard'a yönlendir
          navigate('/admin/ziraat');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      // Debug: Hata detayları
      console.error('❌ Giriş hatası:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        data: err.response?.data,
        error: err.message
      });
      
      setError(err.response?.data?.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  // Bu kısım kaldı 
  const handleSocialLogin = (provider: 'github' | 'linkedin') => {
    // Örnek veriler - Gerçek OAuth entegrasyonunda bu veriler API'den gelecek
    const socialData = {
      github: {
        firstName: 'GitHub',
        lastName: 'Kullanıcı',
        email: 'github@example.com',
        provider: 'github'
      },
      linkedin: {
        firstName: 'LinkedIn',
        lastName: 'Kullanıcı',
        email: 'linkedin@example.com',
        provider: 'linkedin'
      }
    };

    const data = socialData[provider];
    // Query parametreleri ile kayıt sayfasına yönlendir
    const params = new URLSearchParams({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      provider: data.provider
    });
    
    navigate(`/kayit?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
        {/* Logo ve Başlık */}
        <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
                </svg>
                <h1 className="text-2xl font-bold text-content-light dark:text-content-dark">Yeşil-Eksen</h1>
            </div>
            <h2 className="text-3xl font-bold text-content-light dark:text-content-dark">Hesabınıza Giriş Yapın</h2>
            <p className="mt-2 text-sm text-subtle-light dark:text-subtle-dark">
                Hesabınız yok mu?{' '}
                <Link to="/kayit" className="font-medium text-primary hover:text-primary/80 transition-colors">Kayıt olun</Link>
            </p>
            <p className="mt-1 text-sm text-subtle-light dark:text-subtle-dark">
                <Link to="/" className="font-medium text-primary hover:text-primary/80 transition-colors">← Anasayfaya Dön</Link>
            </p>
        </div>

        {/* Giriş Formu */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}
            <div className="space-y-4">
                {/* E-posta/Telefon */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        E-posta veya Telefon
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">person</span>
                        <input 
                            id="email" 
                            name="email" 
                            type="text" 
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors" 
                            placeholder="E-posta veya telefon numaranız"
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Şifre */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-content-light dark:text-content-dark mb-2">
                        Şifre
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">lock</span>
                        <input 
                            id="password" 
                            name="password" 
                            type={showPassword ? "text" : "password"} 
                            required 
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full pl-10 pr-10 py-3 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors" 
                            placeholder="Şifreniz"
                            disabled={loading}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined">
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Şifremi Unuttum */}
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input 
                        id="remember-me" 
                        name="remember-me" 
                        type="checkbox" 
                        checked={formData.rememberMe}
                        onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                        className="h-4 w-4 text-primary focus:ring-primary border-border-light dark:border-border-dark rounded"
                        disabled={loading}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-subtle-light dark:text-subtle-dark">
                        Beni hatırla
                    </label>
                </div>
                <div className="text-sm">
                    <Link to="/sifremi-unuttum" className="font-medium text-primary hover:text-primary/80 transition-colors">
                        Şifremi unuttum
                    </Link>
                </div>
            </div>

            {/* Giriş Butonu */}
            <div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <span className={`material-symbols-outlined text-white ${loading ? 'animate-spin' : ''}`}>
                            {loading ? 'refresh' : 'login'}
                        </span>
                    </span>
                    {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </button>
            </div>

            {/* Sosyal Medya Girişi */}
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border-light dark:border-border-dark"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-background-light dark:bg-background-dark text-subtle-light dark:text-subtle-dark">Veya</span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button 
                        type="button" 
                        onClick={() => handleSocialLogin('github')}
                        className="w-full inline-flex justify-center py-2 px-4 border border-border-light dark:border-border-dark rounded-lg shadow-sm bg-background-light dark:bg-background-dark text-sm font-medium text-content-light dark:text-content-dark hover:bg-primary/5 transition-colors"
                    >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                        </svg>
                        <span className="ml-2">GitHub</span>
                    </button>

                    <button 
                        type="button" 
                        onClick={() => handleSocialLogin('linkedin')}
                        className="w-full inline-flex justify-center py-2 px-4 border border-border-light dark:border-border-dark rounded-lg shadow-sm bg-background-light dark:bg-background-dark text-sm font-medium text-content-light dark:text-content-dark hover:bg-primary/5 transition-colors"
                    >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <span className="ml-2">LinkedIn</span>
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>
  )
}

export default Giris;
