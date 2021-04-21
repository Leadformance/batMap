import { Location } from '@bridge/batMap/src';

import { getRandomInRange } from './numbers';

export function makeLocations(number: number): Location[] {
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
