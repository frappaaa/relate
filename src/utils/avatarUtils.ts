
export const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'bg-red-500',
    'bg-pink-500',
    'bg-purple-500',
    'bg-indigo-500',
    'bg-relate-500',
    'bg-cyan-500',
    'bg-teal-500',
    'bg-green-500',
    'bg-lime-500',
    'bg-yellow-500',
    'bg-orange-500',
    'bg-amber-500'
  ];

  return colors[Math.abs(hash) % colors.length];
};
