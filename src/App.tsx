import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles, Search, Copy, Check, Loader2, Tag, Type, FileText,
  TrendingUp, AlertTriangle, ShieldCheck, ShieldX, Zap, Hash, X, Shirt, StickyNote, Languages,
  Gauge, Crown, Lock, ExternalLink, Palette, Sparkle,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { AppProvider, useApp } from '@/components/Toast';
import {
  generateMetadata, checkTrademark, getTagsAsCommaString,
  type MetadataResult, type CompetitionLevel, type Platform,
  PLATFORM_LIMITS,
} from '@/tagEngine';
import { type Language } from '@/i18n';

const DAILY_FREE_LIMIT = 5;
const CREATIVE_FABRICA_URL = 'https://www.creativefabrica.com/ref/29097240/';
const LEMON_SQUEEZY_CHECKOUT_URL = 'https://podmetrics-ai.lemonsqueezy.com/checkout/buy/0a0871e4-bcdd-4a55-ab66-80dd4af24e3e';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const SANITIZE_RE = /[<>"'&\u0000-\u001f\u007f]/g;

function sanitizeInput(input: string): string {
  return input.replace(SANITIZE_RE, '').trim().slice(0, 100);
}

function getClientId(): string {
  const key = 'pod_client_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function getTodayDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function getLocalUsage(): number {
  const today = getTodayDateStr();
  const data = localStorage.getItem('pod_usage');
  if (!data) return 0;
  try {
    const parsed = JSON.parse(data);
    if (parsed.date === today) return parsed.count;
    return 0;
  } catch {
    return 0;
  }
}

function setLocalUsage(count: number) {
  const today = getTodayDateStr();
  localStorage.setItem('pod_usage', JSON.stringify({ date: today, count }));
}

function openLemonSqueezyCheckout(): void {
  if (window.LemonSqueezy?.Url?.Open && LEMON_SQUEEZY_CHECKOUT_URL) {
    window.LemonSqueezy.Url.Open(LEMON_SQUEEZY_CHECKOUT_URL);
  } else if (LEMON_SQUEEZY_CHECKOUT_URL) {
    window.open(LEMON_SQUEEZY_CHECKOUT_URL, '_blank', 'noopener,noreferrer');
  }
}

const competitionConfig: Record<Language, Record<CompetitionLevel, { label: string; color: string; bg: string; border: string; bar: string }>> = {
  en: {
    low: { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', bar: 'bg-emerald-400' },
    medium: { label: 'Med', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', bar: 'bg-amber-400' },
    high: { label: 'High', color: 'text-danger-400', bg: 'bg-danger-500/10', border: 'border-danger-500/30', bar: 'bg-danger-400' },
  },
  ar: {
    low: { label: 'منخفض', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', bar: 'bg-emerald-400' },
    medium: { label: 'متوسط', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', bar: 'bg-amber-400' },
    high: { label: 'مرتفع', color: 'text-danger-400', bg: 'bg-danger-500/10', border: 'border-danger-500/30', bar: 'bg-danger-400' },
  },
};

const platformConfig: Record<Platform, { label: string; icon: typeof Shirt; gradient: string }> = {
  redbubble: { label: 'Redbubble', icon: Shirt, gradient: 'from-brand-500 to-cyan-500' },
  etsy: { label: 'Etsy', icon: StickyNote, gradient: 'from-amber-500 to-brand-500' },
};

const exampleKeywords = [
  'vintage cat lover', 'retro gaming', 'mountain hiking', 'coffee addict', 'plant mom',
  'gamer life', 'ocean sunset', 'cyberpunk city', 'book worm', 'dog dad',
];

const productTypePresets: Record<Platform, string[]> = {
  redbubble: ['T-Shirt', 'Sticker', 'Hoodie', 'Poster', 'Phone Case', 'Tote Bag'],
  etsy: ['T-Shirt', 'Mug', 'Sticker', 'Hoodie', 'Poster', 'Tote Bag'],
};



async function copyToClipboardWithFallback(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to fallback
  }
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

function CopyButton({ onCopy, copied, label }: { onCopy: () => void; copied: boolean; label: string }) {
  return (
    <button
      onClick={onCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        copied
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          : 'bg-rb-700/60 text-rb-300 border border-rb-600/50 hover:text-brand-300 hover:border-brand-500/30'
      }`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? '✓' : label}
    </button>
  );
}

function ComplianceCounter({ current, max, label }: { current: number; max: number; label: string }) {
  const ratio = current / max;
  const color = ratio <= 0.8 ? 'text-emerald-400' : ratio <= 1 ? 'text-amber-400' : 'text-danger-400';
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-rb-400">{label}:</span>
      <span className={`font-mono font-semibold ${color}`}>{current}/{max}</span>
    </div>
  );
}

function LanguageSwitcher() {
  const { lang, setLang } = useApp();
  const langs: Language[] = ['en', 'ar'];

  return (
    <div className="inline-flex items-center rounded-xl glass border border-rb-600/40 overflow-hidden">
      <Languages className="w-4 h-4 text-rb-400 mx-2.5 shrink-0" />
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3.5 py-2 text-xs font-bold tracking-wide transition-all ${
            lang === l
              ? 'bg-gradient-to-r from-brand-500 to-cyan-500 text-white'
              : 'text-rb-300 hover:text-rb-100'
          }`}
        >
          {l === 'en' ? 'EN' : 'AR'}
        </button>
      ))}
    </div>
  );
}

function OpportunityScoreCard({ score, competition, lang, t }: { score: number; competition: CompetitionLevel; lang: Language; t: ReturnType<typeof useApp>['t'] }) {
  const compCfg = competitionConfig[lang][competition];
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;
  const scoreColor = score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-danger-400';
  const ringColor = score >= 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171';

  return (
    <div className="glass border border-rb-600/40 rounded-2xl p-6 animate-fade-up card-glow">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
          <Gauge className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-display font-semibold text-base text-rb-100">{t.opportunityScoreTitle}</h3>
        <span className="text-xs text-rb-400">— {t.opportunityScoreDesc}</span>
      </div>

      <div className="flex items-center gap-6 flex-wrap">
        {/* Circular gauge */}
        <div className="relative shrink-0">
          <svg width="120" height="120" className="transform -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52" fill="none" stroke={ringColor} strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold font-mono ${scoreColor}`}>{score}</span>
            <span className="text-xs text-rb-400 font-mono">/ 100</span>
          </div>
        </div>

        {/* Competition badge */}
        <div className="flex flex-col gap-3 flex-1 min-w-[180px]">
          <div>
            <span className="text-xs text-rb-400 block mb-1.5">{t.nicheCompetitionLabel}</span>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${compCfg.bg} ${compCfg.border} ${compCfg.color} font-semibold text-sm`}>
              <div className={`w-2 h-2 rounded-full ${compCfg.bar}`} />
              {compCfg.label}
            </span>
          </div>
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${i < Math.ceil(score / 20) ? compCfg.bar : 'bg-rb-700/50'}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProModal({ onClose, t }: { onClose: () => void; t: ReturnType<typeof useApp>['t'] }) {
  const features = [t.proFeature1, t.proFeature2, t.proFeature3];

  useEffect(() => {
    if (window.createLemonSqueezy) {
      window.createLemonSqueezy();
    }
  }, []);

  const handleCheckout = () => {
    openLemonSqueezyCheckout();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-strong border border-brand-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-up">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-rb-400 hover:text-rb-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Crown icon */}
        <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mb-5 mx-auto">
          <Crown className="w-8 h-8 text-white" />
        </div>

        <h2 className="font-display font-bold text-2xl text-rb-100 text-center mb-2">{t.proModalTitle}</h2>
        <p className="text-sm text-rb-300 text-center mb-6">{t.proModalDesc}</p>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rb-950/60 border border-rb-600/40">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-sm text-rb-200">{f}</span>
            </div>
          ))}
        </div>

        {/* Price + checkout */}
        <div className="text-center mb-4">
          <span className="text-3xl font-bold gradient-text">{t.proPrice}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl gradient-brand text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-500/40 transition-all hover:scale-[1.02]"
        >
          <Zap className="w-4 h-4" />
          {t.proCheckoutBtn}
        </button>
        <button
          onClick={onClose}
          className="w-full mt-2 px-6 py-3 rounded-xl text-rb-400 hover:text-rb-200 text-xs font-medium transition-colors"
        >
          {t.proCloseBtn}
        </button>
      </div>
    </div>
  );
}

function AffiliateBanner({ t, isRTL }: { t: ReturnType<typeof useApp>['t']; isRTL: boolean }) {
  return (
    <div className="glass border border-rb-600/40 rounded-2xl p-6 animate-fade-up card-glow overflow-hidden relative">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="flex flex-col sm:flex-row items-center gap-5 relative">
        <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center shrink-0">
          <Palette className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 text-center sm:text-start">
          <h3 className="font-display font-semibold text-base text-rb-100 mb-1 flex items-center gap-2 justify-center sm:justify-start">
          <span>{t.affiliateTitle}</span>
          </h3>
          <p className="text-sm text-rb-300">{t.affiliateDesc}</p>
        </div>
        <a
          href={CREATIVE_FABRICA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-500/30 transition-all hover:scale-105 whitespace-nowrap shrink-0"
        >
          {t.affiliateBtn}
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

function GeneratorTool() {
  const { showToast, lang, t, isRTL } = useApp();
  const [platform, setPlatform] = useState<Platform>('redbubble');
  const [keyword, setKeyword] = useState('');
  const [productType, setProductType] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MetadataResult | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedTagIdx, setCopiedTagIdx] = useState<number | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [showProModal, setShowProModal] = useState(false);
  const clientIdRef = useRef<string>('');

  const limits = PLATFORM_LIMITS[platform];
  const compCfg = competitionConfig[lang];
  const searchesLeft = DAILY_FREE_LIMIT - usageCount;
  const isLimitReached = searchesLeft <= 0;

  const fetchUsageCount = useCallback(async () => {
    const localCount = getLocalUsage();
    setUsageCount(localCount);

    if (supabase && clientIdRef.current) {
      try {
        const url = `${SUPABASE_URL}/functions/v1/check-usage`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ client_id: clientIdRef.current }),
        });
        if (res.ok) {
          const data = await res.json();
          const serverCount = data.count ?? 0;
          const effective = Math.max(serverCount, localCount);
          setUsageCount(effective);
          if (effective > localCount) {
            setLocalUsage(effective);
          }
        }
      } catch {
        // server unavailable, use local count
      }
    }
  }, []);

  useEffect(() => {
    clientIdRef.current = getClientId();
    fetchUsageCount();
  }, [fetchUsageCount]);

  const handlePlatformSwitch = (p: Platform) => {
    setPlatform(p);
    setResult(null);
    setHasGenerated(false);
  };

  const handleGenerate = async () => {
    const cleanKeyword = sanitizeInput(keyword);
    if (!cleanKeyword) {
      showToast(t.toastEnterKeyword, 'error');
      return;
    }
    if (isLimitReached) {
      setShowProModal(true);
      return;
    }
    setLoading(true);
    setHasGenerated(true);
    setResult(null);
    const cleanProduct = sanitizeInput(productType);
    setTimeout(async () => {
      const meta = generateMetadata(cleanKeyword, platform, cleanProduct || undefined);
      setResult(meta);
      setLoading(false);
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      setLocalUsage(newCount);

      if (supabase && clientIdRef.current) {
        try {
          await fetch(`${SUPABASE_URL}/functions/v1/increment-usage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ client_id: clientIdRef.current }),
          });
        } catch {
          // server unavailable, local count still valid
        }
      }

      if (newCount >= DAILY_FREE_LIMIT) {
        setTimeout(() => setShowProModal(true), 500);
      }
    }, 800);
  };

  const copyToClipboard = async (text: string, setter: (v: boolean) => void) => {
    const ok = await copyToClipboardWithFallback(text);
    if (ok) {
      setter(true);
      showToast(t.toastCopied, 'success');
      setTimeout(() => setter(false), 1800);
    } else {
      showToast('Copy failed — please copy manually', 'error');
    }
  };

  const copyTag = async (tag: string, idx: number) => {
    const ok = await copyToClipboardWithFallback(tag);
    if (ok) {
      setCopiedTagIdx(idx);
      showToast(t.toastCopied, 'success');
      setTimeout(() => setCopiedTagIdx(null), 1800);
    } else {
      showToast('Copy failed — please copy manually', 'error');
    }
  };

  const copyAllTags = async () => {
    if (!result) return;
    const allTags = getTagsAsCommaString(result);
    const ok = await copyToClipboardWithFallback(allTags);
    if (ok) {
      setCopiedAll(true);
      showToast(t.toastCopied, 'success');
      setTimeout(() => setCopiedAll(false), 1800);
    } else {
      showToast('Copy failed — please copy manually', 'error');
    }
  };

  const isTrademarkSafe = keyword.trim() && !checkTrademark(keyword);
  const showTrademarkBadge = keyword.trim().length > 0;
  const totalTags = result ? 1 + result.secondaryTags.length : 0;
  const isEtsy = platform === 'etsy';
  const platformLabel = platformConfig[platform].label;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Free searches counter banner */}
      <div className={`mb-4 flex items-center justify-between px-5 py-3 rounded-xl glass border ${isLimitReached ? 'border-danger-500/30' : 'border-rb-600/40'} animate-fade-in`}>
        <div className="flex items-center gap-2.5">
          {isLimitReached ? (
            <Lock className="w-4 h-4 text-danger-400 shrink-0" />
          ) : (
            <Sparkle className="w-4 h-4 text-cyan-400 shrink-0" />
          )}
          <span className={`text-sm font-semibold ${isLimitReached ? 'text-danger-400' : 'text-rb-200'}`}>
            {isLimitReached ? t.limitReached : t.freeSearchesLeft(searchesLeft, DAILY_FREE_LIMIT)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isLimitReached && (
            <button
              onClick={openLemonSqueezyCheckout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg gradient-brand text-white text-xs font-semibold hover:shadow-lg hover:shadow-brand-500/30 transition-all hover:scale-105"
            >
              <Crown className="w-3.5 h-3.5" />
              {t.proCheckoutBtn}
            </button>
          )}
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {[...Array(DAILY_FREE_LIMIT)].map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i < usageCount ? 'bg-brand-500' : 'bg-rb-700/60'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Platform Tabs */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1.5 rounded-xl glass border border-rb-600/40">
          {(Object.keys(platformConfig) as Platform[]).map((p) => {
            const cfg = platformConfig[p];
            const Icon = cfg.icon;
            const isActive = platform === p;
            return (
              <button
                key={p}
                onClick={() => handlePlatformSwitch(p)}
                className={`flex items-center gap-2 px-5 sm:px-8 py-3 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${cfg.gradient} text-white shadow-lg`
                    : 'text-rb-300 hover:text-rb-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Section */}
      <div className="glass border border-rb-600/40 rounded-2xl p-6 lg:p-8 card-glow mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-semibold text-lg text-rb-100">{t.inputTitle}</h2>
            <p className="text-xs text-rb-400">{t.inputDesc}</p>
          </div>
          {/* Trademark badge */}
          {showTrademarkBadge && (
            isTrademarkSafe ? (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 animate-fade-in shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 whitespace-nowrap">{t.trademarkSafe}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-danger-500/10 border border-danger-500/30 animate-fade-in shrink-0">
                <ShieldX className="w-4 h-4 text-danger-400" />
                <span className="text-xs font-bold text-danger-400 whitespace-nowrap">Trademark Risk</span>
              </div>
            )
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder={t.keywordPlaceholder}
              dir="ltr"
              className={`w-full px-4 py-3.5 rounded-xl bg-rb-950/80 border border-rb-600 text-rb-100 placeholder-rb-400 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all ${isRTL ? 'text-left' : ''}`}
            />
            {keyword && (
              <button
                onClick={() => setKeyword('')}
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-rb-400 hover:text-rb-100 transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="relative sm:w-48">
            <input
              type="text"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder={t.productTypePlaceholder}
              dir="ltr"
              className={`w-full px-4 py-3.5 rounded-xl bg-rb-950/80 border border-rb-600 text-rb-100 placeholder-rb-400 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all ${isRTL ? 'text-left' : ''}`}
            />
          </div>
        </div>

        {/* Product type presets */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-xs text-rb-400">{t.productLabel}</span>
          {productTypePresets[platform].map((pt) => (
            <button
              key={pt}
              onClick={() => setProductType(pt)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                productType === pt
                  ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-400'
                  : 'bg-rb-800/50 border border-rb-600/40 text-rb-300 hover:text-cyan-300 hover:border-cyan-500/30'
              }`}
            >
              {pt}
            </button>
          ))}
          {productType && (
            <button
              onClick={() => setProductType('')}
              className="px-2 py-1.5 rounded-lg text-xs text-rb-400 hover:text-rb-100 transition-colors"
            >
              {t.clearButton}
            </button>
          )}
        </div>

        {/* Example keywords */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-xs text-rb-400">{t.tryLabel}</span>
          {exampleKeywords.slice(0, 5).map((ex) => (
            <button
              key={ex}
              onClick={() => setKeyword(ex)}
              className="px-3 py-1.5 rounded-lg bg-rb-800/50 border border-rb-600/40 text-xs text-rb-300 hover:text-brand-300 hover:border-brand-500/30 transition-all"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t.generating}
            </>
          ) : isLimitReached ? (
            <>
              <Lock className="w-4 h-4" />
              {t.limitReached}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {t.generateButton}
            </>
          )}
        </button>

        {/* Trademark warning */}
        {showTrademarkBadge && !isTrademarkSafe && (
          <div className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-danger-500/10 border border-danger-500/30 animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-danger-400 shrink-0" />
            <span className="text-sm text-danger-400">{t.trademarkWarning}</span>
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass border border-rb-600/40 rounded-2xl p-6">
              <div className="h-5 w-32 rounded-md shimmer-bg animate-shimmer mb-4" />
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-10 rounded-lg shimmer-bg animate-shimmer" style={{ animationDelay: `${j * 100}ms` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Compliance bar */}
          <div className="glass border border-rb-600/40 rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 animate-fade-up">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-rb-200">{platformLabel} {t.complianceCheck}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <ComplianceCounter current={totalTags} max={limits.totalTags} label={t.tagsLabel} />
              <ComplianceCounter current={result.productTitle.length} max={limits.titleCharLimit} label={t.titleLabel} />
              <ComplianceCounter current={result.productDescription.length} max={limits.descCharLimit} label={t.descriptionLabel} />
            </div>
          </div>

          {/* Opportunity Score */}
          <OpportunityScoreCard score={result.opportunityScore} competition={result.nicheCompetition} lang={lang} t={t} />

          {/* Main Tag */}
          <div className="glass border border-rb-600/40 rounded-2xl p-6 animate-fade-up card-glow" style={{ animationDelay: '0ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-display font-semibold text-base text-rb-100">{t.mainTagTitle}</h3>
              <span className="text-xs text-rb-400">
                — {isEtsy ? t.mainTagDescEtsy : t.mainTagDescRedbubble}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-rb-950/60 border border-brand-500/30">
              <div className="flex items-center gap-3 min-w-0" dir="ltr">
                <span className="text-lg font-mono font-semibold text-brand-300 break-all">{result.mainTag}</span>
                {isEtsy && (
                  <span className="text-xs text-rb-400 font-mono shrink-0">({result.mainTag.length} {t.chars})</span>
                )}
              </div>
              <div className="shrink-0">
                <CopyButton onCopy={() => copyToClipboard(result.mainTag, setCopiedMain)} copied={copiedMain} label={t.copy} />
              </div>
            </div>
          </div>

          {/* Secondary Tags */}
          <div className="glass border border-rb-600/40 rounded-2xl p-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-cyan flex items-center justify-center">
                  <Tag className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-display font-semibold text-base text-rb-100">
                  {isEtsy ? t.etsyTagsTitle : t.secondaryTagsTitle}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400">
                  {result.secondaryTags.length}/{limits.secondaryTagCount}
                </span>
              </div>
              <CopyButton onCopy={copyAllTags} copied={copiedAll} label={t.copyAllTags(result.secondaryTags.length)} />
            </div>

            {/* Tag cloud */}
            <div className="flex flex-wrap gap-2 mb-5" dir="ltr">
              {result.secondaryTags.map((tagResult, idx) => {
                const comp = compCfg[tagResult.competition];
                const isCopied = copiedTagIdx === idx;
                const overLimit = isEtsy && tagResult.charCount > limits.tagCharLimit;
                return (
                  <button
                    key={idx}
                    onClick={() => copyTag(tagResult.tag, idx)}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:scale-105 ${
                      isCopied
                        ? 'bg-emerald-500/15 border-emerald-500/40'
                        : overLimit
                        ? 'bg-danger-500/10 border-danger-500/30'
                        : `${comp.bg} ${comp.border} hover:border-brand-500/40`
                    }`}
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <span className={`text-xs font-mono ${isCopied ? 'text-emerald-400' : overLimit ? 'text-danger-400' : 'text-rb-100'}`}>
                      {tagResult.tag}
                    </span>
                    <span className={`text-[10px] font-bold ${comp.color}`}>
                      {comp.label}
                    </span>
                    {isEtsy && (
                      <span className={`text-[10px] font-mono ${overLimit ? 'text-danger-400' : 'text-rb-400'}`}>
                        {tagResult.charCount}c
                      </span>
                    )}
                    {isCopied ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-rb-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Comma-separated list */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-3.5 h-3.5 text-rb-400" />
                <span className="text-xs font-medium text-rb-400">{t.commaListLabel}</span>
              </div>
              <div className="p-4 rounded-xl bg-rb-950/60 border border-rb-600/40 font-mono text-sm text-rb-200 leading-relaxed max-h-32 overflow-y-auto scrollbar-thin" dir="ltr">
                {getTagsAsCommaString(result)}
              </div>
            </div>

            {/* Competition legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-rb-600/30 flex-wrap">
              <span className="text-xs text-rb-400">{t.competitionLabel}</span>
              {(['low', 'medium', 'high'] as CompetitionLevel[]).map((level) => {
                const comp = compCfg[level];
                return (
                  <div key={level} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${comp.bar}`} />
                    <span className={`text-xs font-medium ${comp.color}`}>{comp.label}</span>
                  </div>
                );
              })}
              {isEtsy && (
                <span className="text-xs text-rb-400 ms-auto">{t.eachTagMax(limits.tagCharLimit)}</span>
              )}
            </div>
          </div>

          {/* Product Title */}
          <div className="glass border border-rb-600/40 rounded-2xl p-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
                <Type className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-display font-semibold text-base text-rb-100">
                {isEtsy ? t.etsyTitleTitle : t.productTitleTitle}
              </h3>
              <span className="text-xs text-rb-400">
                — {isEtsy ? t.titleDescEtsy : t.titleDescRedbubble}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <p className="text-base text-rb-100 leading-relaxed flex-1 break-words" dir="ltr">{result.productTitle}</p>
              <div className="shrink-0">
                <CopyButton onCopy={() => copyToClipboard(result.productTitle, setCopiedTitle)} copied={copiedTitle} label={t.copy} />
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="glass border border-rb-600/40 rounded-2xl p-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-cyan flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-display font-semibold text-base text-rb-100">{t.productDescTitle}</h3>
              <span className="text-xs text-rb-400">
                — {isEtsy ? t.descDescEtsy : t.descDescRedbubble}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm text-rb-200 leading-relaxed flex-1 whitespace-pre-line" dir="ltr">{result.productDescription}</div>
              <div className="shrink-0">
                <CopyButton onCopy={() => copyToClipboard(result.productDescription, setCopiedDesc)} copied={copiedDesc} label={t.copy} />
              </div>
            </div>
          </div>

          {/* Affiliate Banner */}
          <AffiliateBanner t={t} isRTL={isRTL} />
        </div>
      )}

      {/* Empty state */}
      {!hasGenerated && !loading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rb-800/50 border border-rb-600/40 mb-4">
            <Sparkles className="w-8 h-8 text-rb-400" />
          </div>
          <p className="text-rb-300 text-sm max-w-md mx-auto">
            {isEtsy ? t.emptyStateEtsy : t.emptyStateRedbubble}
          </p>
        </div>
      )}

      {/* Pro Modal */}
      {showProModal && <ProModal onClose={() => setShowProModal(false)} t={t} />}
    </div>
  );
}

function App() {
  const { lang, isRTL, t } = useApp();

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  return (
    <div className="min-h-screen bg-rb-950 text-rb-100 overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative pt-12 pb-8 text-center">
        {/* Top-right controls: upgrade button + language switcher */}
        <div className={`absolute top-6 flex items-center gap-3 ${isRTL ? 'left-4 sm:left-8' : 'right-4 sm:right-8'}`}>
          <button
            onClick={openLemonSqueezyCheckout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-brand text-white text-xs font-semibold hover:shadow-lg hover:shadow-brand-500/30 transition-all hover:scale-105"
          >
            <Crown className="w-3.5 h-3.5" />
            {t.proCheckoutBtn}
          </button>
          <LanguageSwitcher />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-5 animate-fade-in">
          <TrendingUp className="w-4 h-4 text-brand-400" />
          <span className="text-sm font-medium text-brand-300">{t.badge}</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-rb-100 mb-3">
          {t.titlePre} <span className="gradient-text">{t.titleHighlight}</span> {t.titlePost}
        </h1>
        <p className="text-rb-300 text-base max-w-2xl mx-auto px-4">
          {t.subtitle}
        </p>
      </header>

      {/* Main tool */}
      <main className="relative pb-20 pt-4">
        <GeneratorTool />
      </main>

      {/* Footer */}
      <footer className="relative border-t border-rb-700/50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold text-sm text-rb-200">{t.footerName}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={openLemonSqueezyCheckout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rb-800/50 border border-brand-500/30 text-brand-300 text-xs font-semibold hover:border-brand-500/50 hover:text-brand-200 transition-all"
            >
              <Crown className="w-3.5 h-3.5" />
              {t.proCheckoutBtn}
            </button>
            <p className="text-xs text-rb-400">
              {t.footerDisclaimer}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function AppWithProvider() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
