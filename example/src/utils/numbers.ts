export function getRandomInRange(
  from: number,
  to: number,
  fixed?: number,
): number {
  return +(Math.random() * (to - from) + from).toFixed(fixed);
}
