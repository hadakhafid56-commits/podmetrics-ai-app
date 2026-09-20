import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { translations, type Language, type Translations } from '@/i18n';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface AppContextValue {
  showToast: (message: string, type?: ToastType) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

const toastStyles: Record<ToastType, { bg: string; border: string; icon: typeof CheckCircle2; iconColor: string }> = {
  success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', icon: CheckCircle2, iconColor: 'text-emerald-400' },
  error: { bg: 'bg-danger-500/10', border: 'border-danger-500/40', icon: AlertCircle, iconColor: 'text-danger-400' },
  info: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', icon: Info, iconColor: 'text-cyan-400' },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const isRTL = lang === 'ar';
  const t = translations[lang];

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((tk) => tk.id !== id));
    }, 2500);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((tk) => tk.id !== id));

  return (
    <AppContext.Provider value={{ showToast, lang, setLang, t, isRTL }}>
      {children}
      <div className={`fixed bottom-6 z-[100] flex flex-col gap-3 pointer-events-none ${isRTL ? 'left-6 items-start' : 'right-6 items-end'}`}>
        {toasts.map((toast) => {
          const style = toastStyles[toast.type];
          const Icon = style.icon;
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl glass-strong border ${style.border} ${style.bg} shadow-xl pointer-events-auto animate-slide-in min-w-[260px]`}
            >
              <Icon className={`w-5 h-5 ${style.iconColor} shrink-0`} />
              <span className="text-sm font-medium text-rb-100 flex-1">{toast.message}</span>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-rb-400 hover:text-rb-100 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </AppContext.Provider>
  );
}
