export interface ProfileCardItem {
  name: string;
  photoUrl: string;
  color: string;
  dateOfBirth: string;
  status: 'available' | 'reserved' | 'sold';
  titles?: string;
  gender?: string;
}
