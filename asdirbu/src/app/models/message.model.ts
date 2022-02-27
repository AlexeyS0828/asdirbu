export interface Message {
    sender_id: number;
    receiver_id: number;
    message: string;
    createdAt?: string;
}
