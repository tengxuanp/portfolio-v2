// Environment configuration validator
export function validateEnvConfig() {
  const requiredEnvVars = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  };

  const missing = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn('⚠️  Missing environment variables:', missing);
    return false;
  }

  console.log('✅ All environment variables configured');
  return true;
}

// Default configuration for development
export const appConfig = {
  port: 3089,
  baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3089',
  features: {
    authentication: true,
    richTextEditor: true,
    imageUpload: 'url-only', // Future: 'file-upload'
    syntaxHighlighting: true,
  },
  categories: {
    ctf: {
      name: 'CTF',
      subcategories: ['htb-season-9', 'hack-the-boo-2025', 'oscp-practice']
    },
    flipperZero: {
      name: 'Flipper Zero',
      subcategories: ['hardware-hacking', 'custom-payloads', 'badge-development']
    }
  }
};

export default appConfig;
