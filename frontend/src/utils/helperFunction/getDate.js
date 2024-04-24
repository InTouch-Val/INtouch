export function getDate(card) {
  const date = new Date(card.add_date);
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();

  return `${dayOfWeek}\n${month} ${year}`;
}
