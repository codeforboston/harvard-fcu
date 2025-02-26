import { useCallback, useRef } from 'react';
import { geocode, reverseGeocode } from './util/census';
import { CensusAddressMatch, EligibilityAppStates, CensusTractData } from './types';
import EligibleTracts from './data/tracts';
import AddressBox from './AddressBox';

// Census Geocoding API URLs for reference
// https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress
// https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html

type Props = {
  setPageState: React.Dispatch<React.SetStateAction<EligibilityAppStates>>;
}

const SearchPage: React.FC<Props> = (props: Props) => {
  const { setPageState } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const getAddressByCoords = async (longitude: number, latitude: number) => {
    const matched = await reverseGeocode({ 
      lng: longitude,
      lat: latitude,
    });
    if (inputRef.current) {
      inputRef.current.value = matched.formatted_address;
    }
  };

  // Update the input value on fetching the address
  const handlePlaceChange = useCallback(async (place: google.maps.places.PlaceResult) => {
    // Parse a given Autocomplete prediction
    const addressComponentsToDisplay = ['street_number', 'route', 'neighborhood', 'locality', 'postal_code'];
    const addressPieces: string[] = [];
    let streetAddressDataCount = 0;
    place.address_components?.forEach(component => {
      if (component.types[0] == 'street_number' || component.types[0] == 'route') {
        if (component.long_name) streetAddressDataCount++;
      }
      if (addressComponentsToDisplay.includes(component.types[0])) addressPieces.push(component.long_name);
    })

    if (inputRef.current && addressPieces.length){
      if (streetAddressDataCount < 2 && place.geometry && place.geometry.location) {
        // Handle edge case: if street address is empty, get address by coordinates. Example for testing: "North Shore Community College - Career Services Lynn, MA, USA"
        getAddressByCoords(place.geometry.location.lng(), place.geometry.location.lat());
      } else {
        inputRef.current.value = addressPieces.join(', ');
      }
    }
  }, []);

  // Handle the form submission for geocoding request
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const address = inputRef.current?.value || '';
    if (address.length <= 1) {
      setPageState("incorrect_address");
      return;
    }

    setPageState("loading");

    try {
      // Retrieve geocoding data for the given address
      const censusApiResponse = await geocode({ address });
      const addressMatches = censusApiResponse.result.addressMatches;

      if (!addressMatches || addressMatches.length == 0) {
        setPageState("incorrect_address");
      }

      // Find out if address is eligible and update the page state
      const addressIsEligible = determineEligibility(addressMatches);
      setPageState(addressIsEligible ? "eligible" : "not_eligible");
    }
    catch (error) {
      console.error(error);
      setPageState("error");
    }
  }

  // Process Census API response and find eligible address, if any.
  function determineEligibility(addressMatches: CensusAddressMatch[]) {
    for (const address of addressMatches) {
      const tractData = address.geographies["Census Tracts"];
      // Verify that Census Tract information is available
      if (tractData && tractData.length > 0) {
        // Check if the tractValue is in the eligible tracts list
        if (hasEligibleCensusTract(tractData))
          return true;
      }
    }
    return false;
  }

  function hasEligibleCensusTract(tractData: CensusTractData) {
    return !!tractData.find(t => EligibleTracts.includes(t.GEOID));
  }

  async function getCurrentPosition() {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
  
  return (
    <>
      <form className='elig-form' onSubmit={handleSubmit} >
        <label className='elig-label' htmlFor='address'>Street Address</label>
        <AddressBox className='elig-input' 
                    placeholder='Enter the address' 
                    onPlaceChanged={handlePlaceChange}
                    name='address'
                    id='address'
                    ref={inputRef} />
        <div className='elig-button-wrapper'>
          <button className='elig-button' type='submit'>Search Address</button>
          <button className={'elig-button elig-button-secondary'} type='button'
            onClick={async () => {
              if (!navigator.geolocation)
                throw 'Geolocation API unavailable';
              const position = await getCurrentPosition();
              getAddressByCoords(position.coords.longitude, position.coords.latitude);
          }}>
            <div className='elig-location-svg'></div>
            Use My Location
          </button>
        </div>
      </form>
    </>
)
    
}

export default SearchPage;
