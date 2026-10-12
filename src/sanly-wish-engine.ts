import { WISH_LANGUAGES } from './sanly-wish-languages';
export const supportedWishLanguages = WISH_LANGUAGES;
export const WISH_STYLES = ['Heartfelt','Warm','Funny','Short & Sweet','Traditional','Inspirational','Poetic','Playful','Aussie Casual'] as const;
export type WishStyle = typeof WISH_STYLES[number];
