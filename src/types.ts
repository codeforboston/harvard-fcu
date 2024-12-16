// Adapted from https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html#_Toc172117434
export type CensusAddressMatch = {
    tigerLine: {
        side: string,
        tigerLineId: string
    },
    coordinates: {
        x: number,
        y: number
    },
    addressComponents: {
        zip: string,
        streetName: string,
        preType: string,
        city: string,
        preDirection: string,
        suffixDirection: string,
        fromAddress: string,
        state: string,
        suffixType: string,
        toAddress: string,
        suffixQualifier: string,
        preQualifier: string
    },
    geographies: {
        "Census Tracts": [
            {
                "SUFFIX": string,
                "POP100": number,
                "GEOID": string,
                "CENTLAT": string,
                "BLOCK": string,
                "AREAWATER": number
                "STATE": string,
                "BASENAME": string,
                "OID": string,
                "LSADC": string,
                "INTPTLAT": string,
                "FUNCSTAT": string,
                "NAME": string,
                "OBJECTID": number,
                "TRACT": string,
                "CENTLON": string,
                "BLKGRP": string,
                "AREALAND": number,
                "HU100": number,
                "INTPTLON": string,
                "MTFCC": string,
                "LWBLKTYP": string,
                "UR": string,
                "COUNTY": string
            }]
        
    }
    matchedAddress: string
};

export type CensusApiResponse = {
    result: {
        input: {
            address: { address: string },
            benchmark: {
                isDefault: boolean,
                benchmarkDescription: string,
                id: string,
                benchmarkName: string
            }
        },
        addressMatches: CensusAddressMatch[]
    }
}

export type EligibilityAppStates = "search" | "loading" | "eligible" | "not_eligible" | "error" | "no_address";