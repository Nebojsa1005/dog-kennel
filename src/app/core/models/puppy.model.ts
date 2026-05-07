export interface Puppy {
  id?: string;
  litterId: string;
  breedId: string;
  name: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  color: string;
  photoBase64: string;
  status: 'available' | 'reserved' | 'sold';
  createdAt: number;
}
