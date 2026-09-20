export type Language = 'en' | 'ar';

export interface Translations {
  // Header
  badge: string;
  titlePre: string;
  titleHighlight: string;
  titlePost: string;
  subtitle: string;

  // Language switcher
  langEn: string;
  langAr: string;

  // Platform tabs
  platformRedbubble: string;
  platformEtsy: string;

  // Input section
  inputTitle: string;
  inputDesc: string;
  keywordPlaceholder: string;
  productTypePlaceholder: string;
  productLabel: string;
  clearButton: string;
  tryLabel: string;
  generateButton: string;
  generating: string;

  // Trademark warning
  trademarkWarning: string;

  // Compliance
  complianceCheck: string;
  tagsLabel: string;
  titleLabel: string;
  descriptionLabel: string;

  // Main tag
  mainTagTitle: string;
  mainTagDescRedbubble: string;
  mainTagDescEtsy: string;
  copy: string;
  copied: string;
  chars: string;

  // Secondary tags
  secondaryTagsTitle: string;
  etsyTagsTitle: string;
  copyAllTags: (count: number) => string;
  commaListLabel: string;
  competitionLabel: string;
  eachTagMax: (limit: number) => string;

  // Competition levels
  compLow: string;
  compMedium: string;
  compHigh: string;

  // Title section
  productTitleTitle: string;
  etsyTitleTitle: string;
  titleDescRedbubble: string;
  titleDescEtsy: string;

  // Description section
  productDescTitle: string;
  descDescRedbubble: string;
  descDescEtsy: string;

  // Empty state
  emptyStateRedbubble: string;
  emptyStateEtsy: string;

  // Toast messages
  toastCopied: string;
  toastEnterKeyword: string;

  // Footer
  footerName: string;
  footerDisclaimer: string;

  // Trademark safe badge
  trademarkSafe: string;

  // Opportunity score
  opportunityScoreTitle: string;
  opportunityScoreDesc: string;
  nicheCompetitionLabel: string;

  // Daily usage limits
  freeSearchesLeft: (left: number, total: number) => string;
  limitReached: string;
  proModalTitle: string;
  proModalDesc: string;
  proFeature1: string;
  proFeature2: string;
  proFeature3: string;
  proPrice: string;
  proCheckoutBtn: string;
  proCloseBtn: string;

  // Affiliate banner
  affiliateTitle: string;
  affiliateDesc: string;
  affiliateBtn: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    badge: 'SEO Metadata Generator for POD Sellers',
    titlePre: 'POD',
    titleHighlight: 'Tag & Description',
    titlePost: 'Generator',
    subtitle:
      'Generate high-converting SEO tags, catchy product titles, and compelling descriptions for your Redbubble and Etsy designs — all in seconds.',

    langEn: 'EN',
    langAr: 'AR',

    platformRedbubble: 'Redbubble',
    platformEtsy: 'Etsy',

    inputTitle: 'Niche / Keyword Input',
    inputDesc: 'Enter your design niche and optionally a product type',
    keywordPlaceholder: 'e.g., vintage cat lover, retro gaming, mountain hiking...',
    productTypePlaceholder: 'Product type (optional)',
    productLabel: 'Product:',
    clearButton: 'Clear',
    tryLabel: 'Try:',
    generateButton: 'Generate SEO Tags & Metadata',
    generating: 'Generating...',

    trademarkWarning:
      'Warning: This keyword may contain a protected trademark. Use with caution to avoid account issues.',

    complianceCheck: 'Compliance Check',
    tagsLabel: 'Tags',
    titleLabel: 'Title',
    descriptionLabel: 'Description',

    mainTagTitle: 'Main Tag',
    mainTagDescRedbubble: '— Primary high-volume tag',
    mainTagDescEtsy: '— Highly targeted focus keyword',
    copy: 'Copy',
    copied: 'Copied!',
    chars: 'chars',

    secondaryTagsTitle: 'Secondary Tags',
    etsyTagsTitle: 'Etsy Tags',
    copyAllTags: (count) => `Copy All ${count} Tags`,
    commaListLabel: 'Comma-separated list (ready to paste):',
    competitionLabel: 'Competition:',
    eachTagMax: (limit) => `Each tag max ${limit} characters`,

    compLow: 'Low',
    compMedium: 'Med',
    compHigh: 'High',

    productTitleTitle: 'Product Title',
    etsyTitleTitle: 'Etsy Title',
    titleDescRedbubble: '— Short, punchy & SEO-optimized',
    titleDescEtsy: '— Long-tail, keyword-stuffed format',

    productDescTitle: 'Product Description',
    descDescRedbubble: '— Compelling & keyword-rich',
    descDescEtsy: '— Bullet points with keyword placement',

    emptyStateRedbubble:
      'Enter your niche keyword above and click Generate to get 15 SEO-optimized tags, a catchy product title, and a compelling description — tailored for Redbubble.',
    emptyStateEtsy:
      'Enter your niche keyword above and click Generate to get 13 Etsy-compliant tags (under 20 chars each), a keyword-stuffed title, and a bullet-point description.',

    toastCopied: 'Copied to clipboard!',
    toastEnterKeyword: 'Please enter a niche or keyword first',

    footerName: 'POD Tag Generator',
    footerDisclaimer:
      'Not affiliated with Redbubble or Etsy. Tags are AI-generated — always review before publishing.',

    trademarkSafe: '100% Trademark Safe',

    opportunityScoreTitle: 'Niche Opportunity Score',
    opportunityScoreDesc: 'Based on competition analysis and search volume potential',
    nicheCompetitionLabel: 'Niche Competition',

    freeSearchesLeft: (left, total) => `Free Searches Left: ${left}/${total}`,
    limitReached: 'Daily free search limit reached',
    proModalTitle: 'Upgrade to PODMetrics Pro',
    proModalDesc: 'You\'ve used all your free searches for today. Upgrade to unlock unlimited SEO tag generation.',
    proFeature1: 'Unlimited daily searches',
    proFeature2: 'Advanced competition analytics',
    proFeature3: 'Priority AI generation',
    proPrice: '$9.99/month',
    proCheckoutBtn: 'Upgrade Now — $9.99/month',
    proCloseBtn: 'Maybe later',

    affiliateTitle: 'Need Premium Fonts & POD Graphics?',
    affiliateDesc: 'Get unlimited commercial-use assets, graphics, and fonts to create top-selling designs.',
    affiliateBtn: 'Explore Assets on Creative Fabrica',
  },

  ar: {
    badge: 'مولد بيانات SEO الوصفية لبائعي الطباعة عند الطلب',
    titlePre: 'مولد',
    titleHighlight: 'الوسوم والأوصاف',
    titlePost: 'للطباعة عند الطلب',
    subtitle:
      'أنشئ وسوم SEO عالية التحويل، وعناوين منتجات جذابة، وأوصاف مقنعة لتصاميمك على Redbubble و Etsy — في ثوانٍ معدودة.',

    langEn: 'EN',
    langAr: 'AR',

    platformRedbubble: 'Redbubble',
    platformEtsy: 'Etsy',

    inputTitle: 'إدخال المجال / الكلمة المفتاحية',
    inputDesc: 'أدخل مجال تصميمك ونوع المنتج اختيارياً',
    keywordPlaceholder: 'مثال: عشاق القطط الكلاسيكية، الألعاب الريترو، تسلق الجبال...',
    productTypePlaceholder: 'نوع المنتج (اختياري)',
    productLabel: 'المنتج:',
    clearButton: 'مسح',
    tryLabel: 'جرّب:',
    generateButton: 'توليد وسوم SEO والبيانات الوصفية',
    generating: 'جاري التوليد...',

    trademarkWarning:
      'تحذير: قد تحتوي هذه الكلمة المفتاحية على علامة تجارية محمية. استخدمها بحذر لتجنب مشاكل الحساب.',

    complianceCheck: 'فحص التوافق',
    tagsLabel: 'الوسوم',
    titleLabel: 'العنوان',
    descriptionLabel: 'الوصف',

    mainTagTitle: 'الوسم الرئيسي',
    mainTagDescRedbubble: '— وسم رئيسي عالي الحجم',
    mainTagDescEtsy: '— كلمة مفتاحية مستهدفة بدقة',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    chars: 'حرف',

    secondaryTagsTitle: 'الوسوم الثانوية',
    etsyTagsTitle: 'وسوم Etsy',
    copyAllTags: (count) => `نسخ جميع الوسوم (${count})`,
    commaListLabel: 'قائمة مفصولة بفواصل (جاهزة للّصق):',
    competitionLabel: 'المنافسة:',
    eachTagMax: (limit) => `الحد الأقصى لكل وسم ${limit} حرف`,

    compLow: 'منخفض',
    compMedium: 'متوسط',
    compHigh: 'مرتفع',

    productTitleTitle: 'عنوان المنتج',
    etsyTitleTitle: 'عنوان Etsy',
    titleDescRedbubble: '— قصير وجذاب ومحسّن لمحركات البحث',
    titleDescEtsy: '— تنسيق طويل مليء بالكلمات المفتاحية',

    productDescTitle: 'وصف المنتج',
    descDescRedbubble: '— مقنع وغني بالكلمات المفتاحية',
    descDescEtsy: '— نقاط نقطية مع وضع الكلمات المفتاحية',

    emptyStateRedbubble:
      'أدخل كلمة مجالك المفتاحية أعلاه واضغط توليد للحصول على 15 وسماً محسّناً لـ SEO، وعنوان منتج جذاب، ووصف مقنع — مصمم خصيصاً لـ Redbubble.',
    emptyStateEtsy:
      'أدخل كلمة مجالك المفتاحية أعلاه واضغط توليد للحصول على 13 وسماً متوافقاً مع Etsy (أقل من 20 حرفاً لكل وسم)، وعنوان مليء بالكلمات المفتاحية، ووصف بنقاط نقطية.',

    toastCopied: 'تم النسخ إلى الحافظة!',
    toastEnterKeyword: 'الرجاء إدخال مجال أو كلمة مفتاحية أولاً',

    footerName: 'مولد وسوم الطباعة عند الطلب',
    footerDisclaimer:
      'غير تابع لـ Redbubble أو Etsy. الوسوم مولّدة بالذكاء الاصطناعي — راجعها دائماً قبل النشر.',

    trademarkSafe: 'آمن 100% من العلامات التجارية',

    opportunityScoreTitle: 'درجة فرصة المجال',
    opportunityScoreDesc: 'مبنية على تحليل المنافسة وإمكانات حجم البحث',
    nicheCompetitionLabel: 'منافسة المجال',

    freeSearchesLeft: (left, total) => `عمليات البحث المجانية المتبقية: ${left}/${total}`,
    limitReached: 'تم الوصول إلى حد البحث المجاني اليومي',
    proModalTitle: 'الترقية إلى PODMetrics Pro',
    proModalDesc: 'لقد استخدمت جميع عمليات البحث المجانية لليوم. قم بالترقية لفتح توليد وسوم SEO غير محدود.',
    proFeature1: 'عمليات بحث يومية غير محدودة',
    proFeature2: 'تحليلات منافسة متقدمة',
    proFeature3: 'توليد بالذكاء الاصطناعي بأولوية',
    proPrice: '$9.99/شهر',
    proCheckoutBtn: 'الترقية الآن — $9.99/شهر',
    proCloseBtn: 'ربما لاحقاً',

    affiliateTitle: 'تحتاج خطوط مميزة ورسومات للطباعة عند الطلب؟',
    affiliateDesc: 'احصل على أصول ورسومات وخطوط استخدام تجاري غير محدودة لإنشاء تصاميم الأكثر مبيعاً.',
    affiliateBtn: 'استكشف الأصول على Creative Fabrica',
  },
};
