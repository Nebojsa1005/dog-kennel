export interface Litter {
  id?: string;
  breedId: string;
  name: string;
  dateOfBirth: string;
  motherName: string;
  fatherName: string;
  status: 'available' | 'reserved' | 'sold';
  createdAt: number;
}
