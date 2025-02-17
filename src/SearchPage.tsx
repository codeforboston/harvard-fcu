import { useCallback, useRef } from 'react';
import { geocode, lookupCoords, reverseGeocode } from './util/census';
import { CensusApiResponse, CensusCoordsApiResponse, EligibilityAppStates } from './types';
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
  const inputRef = useRef<HTMLInputElement>(null)

  // Update the input value on fetching the address
  const handlePlaceChange = useCallback((place: google.maps.places.PlaceResult) => {
    // Parse a given Autocomplete prediction
    // TO-DO: check if it makes sense to refactor it using place.fetchFields()
    const addressComponentsToDisplay = ['street_number', 'route', 'neighborhood', 'locality', 'postal_code'];
    const addressPieces: string[] = [];
    // TO-DO: refactor to use code in Find My Location
    // if street address is empty, get address by coordinates
    place.address_components?.forEach(component => {
      if (addressComponentsToDisplay.includes(component.types[0])) addressPieces.push(component.long_name);
    })
    if (inputRef.current && addressPieces.length){
        inputRef.current.value = addressPieces.join(', ');
      }
  }, [])

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

      // Find out if address is eligible and update the page state
      const addressIsEligible = !!(censusApiResponse && findEligibleAddress(censusApiResponse));
      setPageState(addressIsEligible ? "eligible" : "not_eligible");
    }
    catch (error) {
      console.error(error);
      setPageState("error");
    }
  }

  // Process Census API response and find eligible address, if any.
  function findEligibleAddress(result: CensusApiResponse) {
    const addressMatches = result.result.addressMatches;

    // TO-DO: set state to incorrect_address when addressMatches array is empty
    // if (addressMatches.length == 0) {
    //   setPageState("incorrect_address"); // error state
    // }

    for (const address of addressMatches) { // Check if there is at least one address match and that it contains Census Tract information
      const tractData = address.geographies["Census Tracts"];
      
      // Verify that Census Tract information is available
      if (tractData && tractData.length > 0) {
        const tractValue = tractData[0].GEOID;

        // Check if the tractValue is in the eligible tracts list
        if (EligibleTracts.includes(tractValue))
          return address;
      }
    }
    return null;
  }

  function hasEligibleCensusBlock(result: CensusCoordsApiResponse) {
    return !!result.result.geographies['Census Tracts'].find(t => EligibleTracts.includes(t.GEOID));
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
                    placeholder='Enter your address here...' 
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
              // TO-DO: handle the case when addressMatches is undefined
              const position = await getCurrentPosition();
              const matched = await reverseGeocode({ 
                lng: position.coords.longitude,
                lat: position.coords.latitude,
              });

              if (inputRef.current)
                inputRef.current.value = matched.formatted_address;

              const censusApiResponse = await lookupCoords({ 
                lng: position.coords.longitude,
                lat: position.coords.latitude,
              });

              // Find out if address is eligible and update the page state
              const addressIsEligible = !!(censusApiResponse && hasEligibleCensusBlock(censusApiResponse));
              setPageState(addressIsEligible ? "eligible" : "not_eligible");
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
