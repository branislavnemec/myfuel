export interface Station {
    id?: string;
    name: string;
    name_lowercase: string;
    address?: {
        country: string,
        city: string,
        street: string,
        zip: string
    }
    lat: number;
    lng: number;
    position: any;
    keywords: string[]
}