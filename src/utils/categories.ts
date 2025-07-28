export const categories = [
  { label: 'Électronique', value: 'electronics' },
  { label: 'Vêtements', value: 'clothing' },
  { label: 'Accessoires', value: 'accessories' },
  { label: 'Documents', value: 'documents' },
  { label: 'Clés', value: 'keys' },
  { label: 'Autre', value: 'other' },
];

export const getCategoryLabel = (value: string) => {
  const found = categories.find(cat => cat.value === value);
  return found ? found.label : value;
};
