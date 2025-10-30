const req = (k: string) => {
  const v = import.meta.env[k as keyof ImportMetaEnv] as string | undefined;
  if (!v) throw new Error(`Missing env: ${k}`);
  return v;
};

export const ENV = {
  API_KEY: req("VITE_FIREBASE_API_KEY"),
  AUTH_DOMAIN: req("VITE_FIREBASE_AUTH_DOMAIN"),
  PROJECT_ID: req("VITE_FIREBASE_PROJECT_ID"),
  APP_ID: req("VITE_FIREBASE_APP_ID"),
};
