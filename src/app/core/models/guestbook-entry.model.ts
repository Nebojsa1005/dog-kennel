export interface GuestbookEntry {
  id?: string;
  name: string;
  message: string;
  rating: number; // 1-5
  imageBase64?: string;
  createdAt: number;
}
