/// <reference types="vite/client" />

interface Window {
  createLemonSqueezy?: () => void;
  LemonSqueezy?: {
    Url: {
      Open: (url: string) => void;
    };
  };
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_LEMON_SQUEEZY_CHECKOUT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
