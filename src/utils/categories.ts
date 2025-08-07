export const categories = [
  { label: 'Électronique', value: 'ELECTRONICS', emoji: '📱', aliases: ['electronics', 'électronique'] },
  { label: 'Vêtements', value: 'CLOTHING', emoji: '👕', aliases: ['clothing', 'vêtements'] },
  { label: 'Accessoires', value: 'ACCESSORIES', emoji: '👜', aliases: ['accessories', 'accessoires'] },
  { label: 'Documents', value: 'DOCUMENTS', emoji: '📄', aliases: ['documents'] },
  { label: 'Clés', value: 'KEYS', emoji: '🔑', aliases: ['keys', 'clés'] },
  { label: 'Bagages', value: 'BAGS', emoji: '🎒', aliases: ['bags', 'bagages'] },
  { label: 'Bijoux', value: 'JEWELRY', emoji: '💍', aliases: ['jewelry', 'bijoux'] },
  { label: 'Animaux', value: 'PETS', emoji: '🐾', aliases: ['pets', 'animaux'] },
  { label: 'Autre', value: 'OTHER', emoji: '❓', aliases: ['other', 'autre'] },
];



export const getCategoryLabel = (value: string) => {
  if (!value) return '';
  const normalized = value.trim().toUpperCase();
  const found = categories.find(cat =>
    cat.value === normalized || (cat.aliases && cat.aliases.map(a => a.toUpperCase()).includes(normalized))
  );
  return found ? found.label : value;
};



export const getCategoryEmoji = (value: string) => {
  if (!value) return '';
  const normalized = value.trim().toUpperCase();
  const found = categories.find(cat =>
    cat.value === normalized || (cat.aliases && cat.aliases.map(a => a.toUpperCase()).includes(normalized))
  );
  return found ? found.emoji : '📦';
};
