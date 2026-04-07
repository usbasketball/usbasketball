export interface InstagramPost {
  id: string;
  imageSrc: string;
  alt: string;
  postUrl: string;
  caption?: string;
}

/**
 * To update: save a 600x600 WebP screenshot to public/instagram/,
 * then update the entry below with the new imageSrc, alt, postUrl, and optional caption.
 */
export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "post-1",
    imageSrc: "/instagram/post-1.webp",
    alt: "U.S. Basketball game action",
    postUrl: "https://instagram.com/usbasketbal",
    caption: "Game day!",
  },
  {
    id: "post-2",
    imageSrc: "/instagram/post-2.webp",
    alt: "U.S. Basketball team celebration",
    postUrl: "https://instagram.com/usbasketbal",
    caption: "Champions",
  },
  {
    id: "post-3",
    imageSrc: "/instagram/post-3.webp",
    alt: "U.S. Basketball training session",
    postUrl: "https://instagram.com/usbasketbal",
    caption: "Training time",
  },
  {
    id: "post-4",
    imageSrc: "/instagram/post-4.webp",
    alt: "U.S. Basketball social event",
    postUrl: "https://instagram.com/usbasketbal",
    caption: "Third half",
  },
];
