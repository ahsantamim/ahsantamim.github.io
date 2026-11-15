/** Prefixes a `public/` path with the deploy base path, which `next/image` and plain anchors don't add themselves. */
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
