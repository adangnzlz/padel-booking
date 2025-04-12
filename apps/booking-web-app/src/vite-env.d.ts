/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Puedes añadir más variables de entorno aquí si es necesario
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
