import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

function Ciftlik() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-content-light dark:text-content-dark mb-2">Çiftlik Yönetimi</h1>
            <p className="text-lg text-subtle-light dark:text-subtle-dark">Çiftlik işlemlerinizi yönetin</p>
          </div>
          <div className="bg-background-light dark:bg-background-dark rounded-xl p-6 border border-border-light dark:border-border-dark">
            <h2 className="text-xl font-semibold text-content-light dark:text-content-dark mb-4">Çiftlik Bilgileri</h2>
            <p className="text-subtle-light dark:text-subtle-dark">Bu sayfa geliştirilme aşamasındadır.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Ciftlik;
