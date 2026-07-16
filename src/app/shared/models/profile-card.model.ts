export interface ProfileCardItem {
  name: string;
  breedId: string;
  photoUrl: string;
  photosBase64: string[];
  color: string;
  dateOfBirth: string;
  status: 'available' | 'reserved' | 'sold';
  titles?: string;
  gender?: string;
  description?: string;
}
