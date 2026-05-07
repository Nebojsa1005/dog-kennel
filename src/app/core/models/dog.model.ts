export interface Dog {
  id?: string;
  breedId: string;
  gender: 'male' | 'female';
  name: string;
  dateOfBirth: string;
  color: string;
  titles: string;
  photoBase64: string;
  status: 'available' | 'reserved' | 'sold';
  createdAt: number;
}
