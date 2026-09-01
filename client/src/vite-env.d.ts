/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string;
  readonly VITE_HOTLINE?: string;
  readonly VITE_ZALO?: string;
  readonly VITE_ADDRESS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
