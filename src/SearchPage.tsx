import { useCallback, useRef } from 'react';
import { geocode, lookupCoords } from './util/census';
import { CensusApiResponse, EligibilityAppStates } from './types';
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
  // const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null)
  // const [censusApiResponse, setCensusApiResponse] = useState<CensusApiResponse | null>(null);
  // const addressIsEligible = !!(censusApiResponse && findEligibleAddress(censusApiResponse));

  // Update the input value on text change
  // const handleInputChange = (newValue: string) => {
  //   console.log(newValue);
  //   setInputValue(newValue);
  // }

  // Update the input value on fetching the address
  const handlePlaceChange = useCallback((place: google.maps.places.PlaceResult) => {
    // Parse a given Autocomplete prediction
    // TO-DO: refactor to use place.fetchFields()?
    const addressComponentsToDisplay = ['street_number', 'route', 'neighborhood', 'locality', 'postal_code'];
    const addressPieces: string[] = [];
    place.address_components?.forEach(component => {
      if (addressComponentsToDisplay.includes(component.types[0])) addressPieces.push(component.long_name);
    })
    if (inputRef.current){
        inputRef.current.value = addressPieces.join(', ');
      }
    // setInputValue(addressPieces.join(', '));
  }, [])

  // Handle the form submission for geocoding request
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const address = inputRef.current?.value || ''
    if (!address) {
      // alert("Please input an address.")
      setPageState("no_address");
      return
    }
    setPageState("loading");
    try {
      // Retrieve geocoding data for the given address
      const censusApiResponse = await geocode({ address });
      // console.log('matchedAddress', censusApiResponse.result.addressMatches[0].matchedAddress);
      
      // Find out if address is eligible and update the page state
      // TO-DO: refactor into a function (see Use My Location)
      const addressIsEligible = !!(censusApiResponse && findEligibleAddress(censusApiResponse));
      setPageState(addressIsEligible ? "eligible" : "not_eligible");
    }
    catch (error) {
      console.error(error)
      setPageState("error")
    }
  }

  // Process Census API response and find eligible address, if any.
  function findEligibleAddress(result: CensusApiResponse) {
    const addressMatches = result.result.addressMatches;
    console.log('addressMatches', addressMatches);

    for (const address of addressMatches) { // Check if there is at least one address match and that it contains Census Tract information
      const tractData = address.geographies["Census Tracts"];
      console.log('tractData: ', tractData);
      
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

  async function getCurrentPosition() {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
  
  return (
    <>
      <form onSubmit={handleSubmit} >
        <label className='elig-label'>Street Address</label>
        <AddressBox className='elig-input' 
                    placeholder='Enter your address here...' 
                    onPlaceChanged={handlePlaceChange}
                    name='address'
                    ref={inputRef} />
        <div className='elig-button-wrapper'>
          <button className='elig-button' type='submit'>Search Address</button>
          <button className={'elig-button elig-button-secondary'} type='button'
            onClick={async () => {
              if (!navigator.geolocation)
                throw 'Geolocation API unavailable';
              // TO-DO: handle the case when addressMatches is undefined
              const position = await getCurrentPosition();
              const censusApiResponse = await lookupCoords({ 
                lng: position.coords.longitude,
                lat: position.coords.latitude,
              })
              // Find out if address is eligible and update the page state
              const addressIsEligible = !!(censusApiResponse && findEligibleAddress(censusApiResponse));
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
