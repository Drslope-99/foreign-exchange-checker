export function getDateBefore(days: number): string {
  const date = new Date();

  date.setDate(date.getDate() - days);

  return date.toISOString().split("T")[0];
}

export function sample<T>(array: T[], count: number): T[] {
  if (array.length <= count) {
    return array;
  }

  const step = (array.length - 1) / (count - 1);

  return Array.from({ length: count }, (_, index) => {
    return array[Math.round(index * step)];
  });
}
