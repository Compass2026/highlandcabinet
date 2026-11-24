/**
 * Query parameters for a server-rendered page. In the static fallback build (STATIC_EXPORT=1) there is no request,
 * so the page renders its default state; everywhere else this is exactly `await searchParams`.
 */
export async function queryOf<T extends object>(searchParams: Promise<T>): Promise<Partial<T>> {
  return process.env.STATIC_EXPORT === "1" ? {} : await searchParams;
}
