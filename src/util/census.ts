import { CensusApiResponse, CensusCoordsApiResponse } from '../types';
import { encodeQueryParams, loadJsonp } from './jsonp';

const Url = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";


type GeocodeOptions = {
  address: string,
};

export async function geocode(opts: GeocodeOptions) {
  return await loadJsonp<CensusApiResponse>({
    url: Url,
    queryParams: {
      ...opts,
      'benchmark': 'Public_AR_Census2020',               // Use the 2020 Census benchmark
      'vintage': 'Census2020_Census2020',                // Census 2020 vintage data
      'layers': 'tract',                                 // Specify layers for census tract
      'format': 'jsonp',                                 // Request JSONP format
    }
  })
}

type LookupCoordsOptions = {
  lat: number,
  lng: number
};

export async function lookupCoords(opts: LookupCoordsOptions) {
  return await loadJsonp<CensusCoordsApiResponse>({
    url: "https://geocoding.geo.census.gov/geocoder/geographies/coordinates",
    queryParams: {
      x: opts.lng,
      y: opts.lat,
      'benchmark': 'Public_AR_Census2020',               // Use the 2020 Census benchmark
      'vintage': 'Census2020_Census2020',                // Census 2020 vintage data
      'layers': 'tract',                                 // Specify layers for census tract
      'format': 'jsonp',                                 // Request JSONP format
    }
  })
}

// https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
export async function reverseGeocode(coords: LookupCoordsOptions) {
  const url = 'https://maps.googleapis.com/maps/api/geocode/json?' + encodeQueryParams({ latlng: coords.lat + ',' + coords.lng, key: 'AIzaSyCdouiCnCfm6bg7zZ2uYqF7Id_AFmf3EH4' });
  // ;

  const data = await fetch(url).then(r => r.json());
  return data.results.find((result: any) => (result.types.includes('premise')))
}