import { loadJsonp } from './jsonp';

const Url = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";


type GeocodeOptions = {
  address: string,
};

export async function geocode(opts: GeocodeOptions) {
  return await loadJsonp({
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
  return await loadJsonp({
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