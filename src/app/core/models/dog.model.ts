export interface Dog {
  id?: string;
  breedId: string;
  gender: 'male' | 'female';
  name: string;
  dateOfBirth: string;
  color: string;
  titles: string;
  description?: string;
  photosBase64?: string[];
  photoBase64?: string; // legacy — backward compat with existing RTDB records
  status: 'available' | 'reserved' | 'sold';
  createdAt: number;
}
