export interface Chat {
  id: number;
  name: string;
  displayName: string;
  type: string;
  created_at: string;
}
export interface Message {
  id: number;
  chat_id: number;
  user_id: number;
  message: string;
  created_at: string;
}
