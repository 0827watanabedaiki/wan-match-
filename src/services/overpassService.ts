import { Bone, Trees, Scissors, Stethoscope } from 'lucide-react';

// Types for our app
export type SpotType = 'run' | 'park' | 'salon' | 'hospital';

export interface Spot {
    id: number;
    name: string;
    type: SpotType;
    description: string;
    lat: number;
    lng: number;
    color: string;
    icon: any; // We'll assign the component directly, similar to MapView
}

// Overpass API Response Types
interface OverpassElement {
    type: 'node' | 'way' | 'relation';
    id: number;
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags?: {
        name?: string;
        leisure?: string;
        amenity?: string;
        shop?: string;
        [key: string]: string | undefined;
    };
}

interface OverpassResponse {
    version: number;
    generator: string;
    osm3s: {
        timestamp_osm_base: string;
        copyright: string;
    };
    elements: OverpassElement[];
}

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export const fetchSpotsOnly = async (
    south: number,
    west: number,
    north: number,
    east: number
): Promise<Spot[]> => {
    // Construct Query
    // We want output as JSON, with a timeout
    // We search for nodes and ways (polygons) for parks/dog_parks
    // For ways, we ask for 'center' to get a single point
    const query = `
        [out:json][timeout:25];
        (
            way["leisure"="park"](${south},${west},${north},${east});
            relation["leisure"="park"](${south},${west},${north},${east});
            node["leisure"="dog_park"](${south},${west},${north},${east});
            way["leisure"="dog_park"](${south},${west},${north},${east});
            relation["leisure"="dog_park"](${south},${west},${north},${east});
            node["amenity"="veterinary"](${south},${west},${north},${east});
            way["amenity"="veterinary"](${south},${west},${north},${east});
            relation["amenity"="veterinary"](${south},${west},${north},${east});
            node["shop"="pet_grooming"](${south},${west},${north},${east});
            node["shop"="pet_grooming"](${south},${west},${north},${east});
        );
        out center;
    `;

    try {
        const response = await fetch(OVERPASS_URL, {
            method: 'POST',
            body: 'data=' + encodeURIComponent(query),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.ok) {
            throw new Error(`Overpass API error: ${response.status}`);
        }

        const data: OverpassResponse = await response.json();
        return mapOverpassToSpots(data.elements);

    } catch (error) {
        console.error("Failed to fetch spots from Overpass:", error);
        return [];
    }
};

// Helper to calculate distance in meters (approx)
const getDistanceMeters = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const mapOverpassToSpots = (elements: OverpassElement[]): Spot[] => {
    const initialSpots = elements.map(el => {
        const tags = el.tags || {};
        const rawName = tags.name;

        // Improved detection: Check name for "Dog Run" keywords as fallback
        const isDogRun = tags.leisure === 'dog_park' ||
            (rawName && (rawName.includes('ドッグラン') || rawName.toLowerCase().includes('dog run')));

        // Filter out "Children's Playground" (児童遊園) and similar irrelevant park names
        if (rawName && (rawName.includes('児童遊園') || rawName.includes('プレイパーク'))) return null;

        // Skip spots without names to avoid clutter, UNLESS it's a Dog Run
        if (!rawName && !isDogRun) return null;

        const name = rawName || (isDogRun ? 'ドッグラン (名称なし)' : '名称不明スポット');

        // Determine type
        let type: SpotType = 'park';
        if (isDogRun) type = 'run';
        else if (tags.amenity === 'veterinary') type = 'hospital';
        else if (tags.shop === 'pet_grooming') type = 'salon';
        else if (tags.leisure === 'park' || tags.leisure === 'playground' || tags.leisure === 'garden' || tags.landuse === 'recreation_ground' || tags.leisure === 'pitch' || tags.leisure === 'nature_reserve') type = 'park';

        // Determine coordinates
        // Nodes have lat/lon directly. Ways have 'center' object from 'out center;'
        const lat = el.lat || el.center?.lat || 0;
        const lng = el.lon || el.center?.lon || 0;

        // Skip if coords missing
        if (!lat || !lng) return null;

        // Visuals based on type
        let color = 'bg-gray-400';
        let icon = Trees;

        switch (type) {
            case 'run':
                color = 'bg-green-600';
                icon = Bone;
                break;
            case 'park':
                color = 'bg-green-400';
                icon = Trees;
                break;
            case 'salon':
                color = 'bg-pink-500';
                icon = Scissors;
                break;
            case 'hospital':
                color = 'bg-red-500';
                icon = Stethoscope;
                break;
        }

        return {
            id: el.id, // Use OSM ID
            name,
            type,
            description: 'OpenStreetMapデータ', // Placeholder
            lat,
            lng,
            color,
            icon
        } as Spot;
    }).filter((s): s is Spot => s !== null);

    // Second Pass: Auto-name nameless dog runs based on nearby named parks
    const namedParks = initialSpots.filter(s => s.type === 'park' && !s.name.includes('(名称なし)'));

    return initialSpots.map(spot => {
        const isGenericName = spot.name === 'ドッグラン (名称なし)' || spot.name === 'ドッグラン' || spot.name.toLowerCase() === 'dog run';

        if (spot.type === 'run' && isGenericName) {
            // Find nearest park
            let nearestPark: Spot | null = null;
            let minDist = Infinity;

            for (const park of namedParks) {
                const dist = getDistanceMeters(spot.lat, spot.lng, park.lat, park.lng);
                if (dist < minDist) {
                    minDist = dist;
                    nearestPark = park;
                }
            }

            // Threshold: 300 meters (Run might be part of the park)
            if (nearestPark && minDist < 300) {
                return { ...spot, name: `${nearestPark.name} のドッグラン` };
            }
        }
        return spot;
    });
};
