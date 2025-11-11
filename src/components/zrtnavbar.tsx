import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/admin/ziraat', label: 'Genel Bakış', icon: 'dashboard' },
  { to: '/admin/ziraat/ciftlik', label: 'Çiftlik Yönetimi', icon: 'agriculture' },
  { to: '/admin/ziraat/urun-onay', label: 'Ürün Onayları', icon: 'verified' },
  { to: '/admin/ziraat/ciftlik-onay', label: 'Çiftlik Onayları', icon: 'assignment' },
];

const reportLinks = [
  { to: '/admin/ziraat/raporlar/genel', label: 'Genel Raporlar' },
  { to: '/admin/ziraat/raporlar/sdk', label: 'SDK Raporları' },
  { to: '/admin/ziraat/raporlar/performans', label: 'Performans Analizi' },
];

const desktopLinkClasses = (isActive: boolean) =>
  [
    'group relative inline-flex items-center gap-2 rounded-2xl border px-5 py-2 text-sm font-semibold transition-all duration-200',
    isActive
      ? 'border-primary bg-primary text-white shadow-md'
      : 'border-border-light text-subtle-light hover:border-primary hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:text-subtle-dark dark:hover:border-primary dark:hover:bg-primary/20 dark:hover:text-primary',
  ].join(' ');

const mobileLinkClasses = (isActive: boolean) =>
  [
    'flex items-center gap-3 rounded-2xl border px-4 py-3 text-base font-semibold transition-all duration-200',
    isActive
      ? 'border-primary bg-primary text-white shadow-md'
      : 'border-border-light text-subtle-light hover:border-primary hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:text-subtle-dark dark:hover:border-primary dark:hover:bg-primary/20 dark:hover:text-primary',
  ].join(' ');

function ZrtnNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => {
    setMobileOpen(false);
    setReportsOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-transparent backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border-light bg-background-light px-4 py-4 shadow-xl transition-colors dark:border-border-dark dark:bg-background-dark">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <button
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border-light text-primary transition hover:border-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary md:hidden dark:border-border-dark"
                type="button"
                onClick={toggleMobile}
                aria-label="Ziraat menüsünü aç/kapat"
              >
                <span className="material-symbols-outlined text-xl">{mobileOpen ? 'close' : 'menu'}</span>
              </button>
              <Link
                className="group flex items-center gap-4 rounded-2xl bg-primary/5 px-3 py-2 text-left transition hover:bg-primary/10 dark:bg-primary/10"
                to="/admin/ziraat"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-500 text-white shadow-md transition group-hover:scale-105">
                  <span className="material-symbols-outlined text-xl">eco</span>
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">Ziraat Odası</span>
                  <span className="text-lg font-semibold text-content-light dark:text-content-dark">
                    Yönetim Paneli
                  </span>
                  <span className="text-xs text-subtle-light dark:text-subtle-dark">Sürdürülebilir tarım için kontrol merkezi</span>
                </span>
              </Link>
            </div>

            <nav className="hidden flex-1 items-center justify-center gap-2 md:flex">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={({ isActive }) => desktopLinkClasses(isActive)}>
                  <span className="material-symbols-outlined text-base">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
              <div className="relative">
                <button
                  className={[
                    'inline-flex items-center gap-2 rounded-2xl border px-5 py-2 text-sm font-semibold transition-all duration-200',
                    reportsOpen
                      ? 'border-primary bg-primary text-white shadow-md'
                      : 'border-border-light text-subtle-light hover:border-primary hover:bg-primary/10 hover:text-primary dark:border-border-dark dark:text-subtle-dark dark:hover:border-primary dark:hover:bg-primary/20 dark:hover:text-primary',
                  ].join(' ')}
                  type="button"
                  onClick={() => setReportsOpen((prev) => !prev)}
                >
                  <span className="material-symbols-outlined text-base">bar_chart_4_bars</span>
                  Raporlar
                  <span className="material-symbols-outlined text-base">{reportsOpen ? 'expand_less' : 'expand_more'}</span>
                </button>
                {reportsOpen && (
                  <div className="absolute right-0 top-full mt-3 w-60 rounded-2xl border border-border-light bg-background-light p-3 shadow-2xl dark:border-border-dark dark:bg-background-dark">
                    {reportLinks.map((report) => (
                      <NavLink
                        key={report.to}
                        to={report.to}
                        className={({ isActive }) =>
                          [
                            'block rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-subtle-light hover:bg-primary/10 hover:text-primary dark:text-subtle-dark dark:hover:bg-primary/20 dark:hover:text-primary',
                          ].join(' ')
                        }
                        onClick={() => setReportsOpen(false)}
                      >
                        {report.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-2 rounded-2xl bg-primary/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
                <span className="material-symbols-outlined text-sm">bolt</span>
                Canlı İzleme
              </div>
              <Link
                to="/giris"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                Oturumu Kapat
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Link
                to="/giris"
                className="inline-flex items-center gap-2 rounded-2xl border border-border-light px-3 py-2 text-xs font-semibold text-subtle-light transition hover:border-primary hover:text-primary dark:border-border-dark dark:text-subtle-dark"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Çıkış
              </Link>
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-7xl px-4 pb-4 sm:px-6 lg:px-8 md:hidden">
          <div className="rounded-3xl border border-border-light bg-background-light p-4 shadow-lg dark:border-border-dark dark:bg-background-dark">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => mobileLinkClasses(isActive)}
                  onClick={closeMobile}
                >
                  <span className="material-symbols-outlined text-base">{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-3 rounded-2xl border border-border-light p-3 dark:border-border-dark">
              <button
                className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-semibold text-subtle-light transition hover:text-primary dark:text-subtle-dark dark:hover:text-primary"
                type="button"
                onClick={() => setReportsOpen((prev) => !prev)}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">bar_chart_4_bars</span>
                  Raporlar
                </span>
                <span className="material-symbols-outlined text-base">{reportsOpen ? 'expand_less' : 'expand_more'}</span>
              </button>
              {reportsOpen && (
                <div className="mt-2 flex flex-col gap-1">
                  {reportLinks.map((report) => (
                    <NavLink
                      key={report.to}
                      to={report.to}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-subtle-light transition hover:bg-primary/10 hover:text-primary dark:text-subtle-dark dark:hover:bg-primary/20 dark:hover:text-primary"
                      onClick={closeMobile}
                    >
                      {report.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-border-light px-4 py-3 text-sm dark:border-border-dark">
              <span className="text-subtle-light dark:text-subtle-dark">Ziraat Odası yönetim panelindesiniz.</span>
              <Link
                to="/giris"
                className="inline-flex items-center gap-2 rounded-2xl border border-border-light px-3 py-1 text-xs font-semibold text-subtle-light transition hover:border-primary hover:text-primary dark:border-border-dark dark:text-subtle-dark"
                onClick={closeMobile}
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Çıkış Yap
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default ZrtnNavbar;
