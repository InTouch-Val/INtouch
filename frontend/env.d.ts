interface ImportMetaEnv {
  BASE_URL: string;
  VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
