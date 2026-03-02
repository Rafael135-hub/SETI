import { getRequestConfig } from 'next-intl/server';
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

// Export locales for middleware
export const locales = ['en', 'de', 'pt', 'es'] as const;