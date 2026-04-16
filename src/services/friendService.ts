import { Friend } from '../types';

type Listener = (friends: Friend[]) => void;

class FriendService {
    private friends: Friend[] = [];
    private listeners: Listener[] = [];
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private center: { lat: number; lng: number } = { lat: 35.181, lng: 136.906 }; // Default Nagoya

    // Generate random friends around a center point
    generateFriendsAround(lat: number, lng: number) {
        this.center = { lat, lng };
        const names = ['ポチ 🐕', 'ハナ 🐩', 'タロウ 🐕‍🦺', 'モコ 🧸', 'レオ 🦁', 'ココ 🐶'];
        const avatars = ['🐕', '🐩', '🐕‍🦺', '🧸', '🦁', '🐶'];

        this.friends = names.map((name, i) => {
            // Random offset within ~1km
            const latOffset = (Math.random() - 0.5) * 0.01;
            const lngOffset = (Math.random() - 0.5) * 0.01;

            return {
                id: String(i + 1),
                name: name,
                avatar: avatars[i],
                location: {
                    lat: lat + latOffset,
                    lng: lng + lngOffset
                },
                lastActive: 'Now',
                status: i % 2 === 0 ? 'walking' : 'online'
            };
        });

        this.notify();
    }

    getFriends(): Promise<Friend[]> {
        return Promise.resolve([...this.friends]);
    }

    subscribe(listener: Listener): () => void {
        this.listeners.push(listener);
        // Immediately notify with current friends
        listener([...this.friends]);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify() {
        this.listeners.forEach(l => l([...this.friends]));
    }

    startSimulation() {
        if (this.intervalId) return;

        this.intervalId = setInterval(() => {
            this.friends = this.friends.map(friend => {
                if (friend.status !== 'walking') return friend;

                // Random walk: move slightly
                const moveLat = (Math.random() - 0.5) * 0.0002;
                const moveLng = (Math.random() - 0.5) * 0.0002;

                return {
                    ...friend,
                    location: {
                        lat: friend.location.lat + moveLat,
                        lng: friend.location.lng + moveLng
                    }
                };
            });
            this.notify();
        }, 3000); // Update every 3 seconds
    }

    stopSimulation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

export const friendService = new FriendService();
