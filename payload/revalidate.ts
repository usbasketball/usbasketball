import { revalidateTag } from "next/cache";

// Payload hooks also run outside a Next request (e.g. the import script), where
// revalidateTag throws. Never let cache invalidation fail a content save.
export function revalidateTags(...tags: string[]) {
  for (const tag of tags) {
    try {
      revalidateTag(tag, "max");
    } catch {
      // Not in a Next.js request context; nothing cached to invalidate.
    }
  }
}
