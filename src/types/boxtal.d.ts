declare module '@boxtal/parcel-point-map' {
    export class BoxtalParcelPointMap {
        constructor(options: {
            domToLoadMap: string;
            accessToken: string;
            debug?: boolean;
            config?: {
                locale?: string;
                parcelPointNetworks?: Array<{ code: string }>;
                options?: {
                    autoSelectNearestParcelPoint?: boolean;
                    primaryColor?: string;
                };
            };
            onMapLoaded?: () => void;
        });

        searchParcelPoints(
            criteria: {
                country: string;
                zipCode: string;
                city?: string;
            },
            callback: (selectedParcelPoint: any) => void
        ): void;
    }
}
