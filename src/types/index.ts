export interface Friend {
    id: string;
    name: string;
    avatar: string; // Emoji for now
    location: { lat: number; lng: number };
    lastActive: string;
    status: 'online' | 'offline' | 'walking';
}
