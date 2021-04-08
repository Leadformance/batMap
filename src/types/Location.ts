export interface Location {
  _id: string;
  name: string;
  localisation: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
}
