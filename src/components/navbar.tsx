
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-2 text-xl font-bold text-content-light dark:text-content-dark" to="/">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
              </svg>
              Yeşil-Eksen
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link className="text-sm font-medium text-subtle-light dark:text-subtle-dark hover:text-primary dark:hover:text-primary transition-colors" to="/">Ana Sayfa</Link>
              <Link className="text-sm font-medium text-subtle-light dark:text-subtle-dark hover:text-primary dark:hover:text-primary transition-colors" to="/ciftlikler">Çiftlik Yönetimi</Link>
              <Link className="text-sm font-medium text-subtle-light dark:text-subtle-dark hover:text-primary dark:hover:text-primary transition-colors" to="/atiklar">Atık Yönetimi</Link>
              <Link className="text-sm font-medium text-subtle-light dark:text-subtle-dark hover:text-primary dark:hover:text-primary transition-colors" to="/admin/sanayi">Sanayi Odası</Link>
              <Link className="text-sm font-medium text-subtle-light dark:text-subtle-dark hover:text-primary dark:hover:text-primary transition-colors" to="/firmalar">Firma Portalı</Link>
              <Link className="text-sm font-medium text-subtle-light dark:text-subtle-dark hover:text-primary dark:hover:text-primary transition-colors" to="/atiklar">Yönetici Paneli</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-subtle-light dark:text-subtle-dark">search</span>
              <input className="w-full max-w-xs pl-10 pr-4 py-2 rounded-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:border-primary transition-colors placeholder:text-subtle-light dark:placeholder:text-subtle-dark" placeholder="Ara..." type="text" />
            </div>
            <button className="p-2 rounded-full bg-white/20 dark:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-subtle-light light:text-subtle-dark">notifications</span>
            </button>
            <Link to="/giris" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-subtle-light dark:text-subtle-dark hover:text-primary dark:hover:text-primary transition-colors">
              <span className="material-symbols-outlined">login</span>
              Giriş
            </Link>
            <Link to="/kayit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;