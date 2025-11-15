import type { ToastState } from '../hooks/useFarmList';

type FarmToastProps = {
  toast: ToastState;
};

function FarmToast({ toast }: FarmToastProps) {
  if (!toast) {
    return null;
  }

  const toneStyles =
    toast.tone === 'success'
      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200'
      : 'border-red-500 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-200';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur dark:shadow-none ${toneStyles}`}
      >
        <span className="material-symbols-outlined text-base">notifications_active</span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

export default FarmToast;
