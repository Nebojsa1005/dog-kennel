export interface BreedData {
  id?: string;
  about: string;
  standards: {
    appearance: string;
    size: string;
    weight: string;
    coat: string;
    colors: string;
  };
}
