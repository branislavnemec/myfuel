export interface Station {
    id?: string;
    name: string;
    address?: {
        country: string,
        city: string,
        street: string,
        zip: string
    };
    lat: number;
    lng: number;
    position: any;
    keywords: string[];
    fuels?: string[];
    prices?: any;
}
