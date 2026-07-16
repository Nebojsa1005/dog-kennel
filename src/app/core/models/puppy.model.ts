export interface Puppy {
  id?: string;
  litterId: string;
  breedId: string;
  name: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  color: string;
  description?: string;
  photosBase64?: string[];
  photoBase64?: string; // legacy — backward compat with existing RTDB records
  status: 'available' | 'reserved' | 'sold';
  createdAt: number;
}
