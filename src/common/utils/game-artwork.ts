const imagePathPattern = /^\/images\/games\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(?:avif|webp|png|jpe?g)$/i;
const artworkKeyPattern = /^[a-z0-9_-]{1,160}$/i;

const isPublicImageUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.username === '' && url.password === '';
  } catch {
    return false;
  }
};

const artworkByKey: Record<string, string> = {
  roblox: '/images/games/roblox.webp',
  ml: '/images/games/mobile-legends.webp',
  'mobile-legends': '/images/games/mobile-legends.webp',
  ff: '/images/games/free-fire.webp',
  'free-fire': '/images/games/free-fire.webp',
  pubg: '/images/games/pubg-mobile.webp',
  'pubg-mobile': '/images/games/pubg-mobile.webp',
  valo: '/images/games/valorant.webp',
  valorant: '/images/games/valorant.webp',
  genshin: '/images/games/genshin-impact.webp',
  'genshin-impact': '/images/games/genshin-impact.webp',
};

export const isValidGameArtworkReference = (value: string) =>
  value.length <= 2048 && (imagePathPattern.test(value) || artworkKeyPattern.test(value) || isPublicImageUrl(value));

export const getGameArtworkPath = (reference: string | null | undefined) => {
  const value = reference?.trim();
  if (!value) return null;
  if (isPublicImageUrl(value)) return value;
  if (imagePathPattern.test(value)) return value;
  if (!artworkKeyPattern.test(value)) return null;
  return artworkByKey[value.toLowerCase()] ?? null;
};
