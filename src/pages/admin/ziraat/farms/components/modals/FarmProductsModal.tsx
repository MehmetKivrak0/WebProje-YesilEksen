type FarmProductsModalProps = {
  open: boolean;
  farmName: string | null;
  products: string[];
  onClose: () => void;
};

function FarmProductsModal({ open, farmName, products, onClose }: FarmProductsModalProps) {
  if (!open || !farmName) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border-light bg-background-light p-6 shadow-2xl dark:border-border-dark dark:bg-background-dark">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">{farmName} Ürünleri</h2>
            <p className="text-sm text-subtle-light dark:text-subtle-dark">
              Çiftliğin sisteme kayıtlı ürün ve atık listesi.
            </p>
          </div>
          <button className="text-subtle-light hover:text-primary dark:text-subtle-dark" onClick={onClose}>
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {products.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border-light p-4 text-sm text-subtle-light dark:border-border-dark dark:text-subtle-dark">
            Henüz ürün veya atık kaydı bulunmuyor.
          </p>
        ) : (
          <ul className="space-y-2">
            {products.map((product) => (
              <li
                key={product}
                className="flex items-center justify-between rounded-lg border border-border-light px-3 py-2 text-sm text-content-light dark:border-border-dark dark:text-content-dark"
              >
                <span>{product}</span>
                <button className="inline-flex items-center gap-1 rounded-full border border-primary/40 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10 dark:border-primary/40 dark:hover:bg-primary/30">
                  <span className="material-symbols-outlined text-base">link</span>
                  Detay
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="rounded-lg border border-border-light px-4 py-2 text-sm text-subtle-light transition-colors hover:bg-primary/10 dark:border-border-dark dark:text-subtle-dark dark:hover:bg-primary/20"
            onClick={onClose}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

export default FarmProductsModal;
