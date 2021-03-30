// Mock data ResultsPage

function getRandomInRange(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

export function makeLocations(number) {
  return Array(number)
    .fill(null)
    .map((_, index) => ({
      _id: 'uuid' + index,
      name: `Location #${index + 1}`,
      localisation: {
        coordinates: {
          latitude: getRandomInRange(45, 46, 3),
          longitude: getRandomInRange(5, 7, 3),
        },
      },
    }));
}
