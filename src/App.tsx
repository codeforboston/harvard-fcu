// Importing the useState hook from React and the CSS file for styling
import { useState, useCallback } from 'react';
import './App.css';

// Importing a component for displaying eligibility responses
import EligibilityResponse from './components/EligibilityResponse';
import { CensusApiResponse } from './types';

import { geocode, lookupCoords } from './util/census';
import EligibleTracts from './data/tracts';
import AddressBox from './AddressBox';
// import SuccessPage from './SuccessPage';

// Census Geocoding API URLs for reference
// https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress
// https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html

// Set default parameters for the Census API request
function findValidAddressForResult(result: CensusApiResponse) {
  const addressMatches = result.result.addressMatches;

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

// Define loading states for the eligibility response component
type EligibilityResponseLoadingStates = "default" | "loading" | "complete" | "error" | "no_address";

async function getCurrentPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// Main App component
function App() {
  // State for input value, valid response status, and loading state of eligibility response
  const [inputValue, setInputValue] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<CensusApiResponse | null>(null)
  const validResponse = !!(apiResponse && findValidAddressForResult(apiResponse))
  const [eligibilityResponseLoadingState, setEligibilityResponseLoadingState] = useState<EligibilityResponseLoadingStates>("default");
  // const pageContent = {
  //   default: {
  //     h3: 'Do you live, work, worship, or attend school in one of our qualified census tracts?',
  //     p: '....',
  //   },
  //   success: ...,
  //   failure: ...,
  // }

  // Update the input value on text change
  const handleInputChange = (newValue: string) => {
    console.log(newValue); // Log new input value for debugging
    setInputValue(newValue); // Update state with the new input value
  }

  // Update the input value on fetching the address
  const handlePlaceChange = useCallback((place: google.maps.places.PlaceResult) => {
    const addressComponents = ['street_number', 'route', 'neighborhood', 'locality', 'postal_code'];
    const pieces: string[] = [];
    place.address_components?.forEach(component => {
      if (addressComponents.includes(component.types[0])) pieces.push(component.long_name);
    })
    setInputValue(pieces.join(' '));
  }, [])

  // Handle the form submission for geocoding request
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!inputValue) {
      // alert("Please input an address.")
      setEligibilityResponseLoadingState("no_address");
      return
    }
    setEligibilityResponseLoadingState("loading"); // Set loading state
    try {
      const result = await geocode({ address: inputValue });
      setEligibilityResponseLoadingState("complete");
      setApiResponse(result);

      console.log(result); // Log result for debugging
    }
    catch (error) {
      console.error(error)
      setEligibilityResponseLoadingState("error")
    }
  }

  // Render different eligibility response states based on loading state

  const renderEligibilityResponse = () => {
  switch (eligibilityResponseLoadingState) {
    case 'default':
      return <div></div>; // Default message
    case 'loading':
      return '...'; // Loading state placeholder
    case 'complete':
      return <EligibilityResponse isValid={validResponse} /> // Show eligibility response
    case 'error':
      return 'An error occurred while processing your request.'; // Error state placeholder
    case 'no_address':
      return 'Please input an address.'
  }
  }

  // Render main application with input, submit button, and eligibility response
  return (
    <div className='eligibilityBox'>
      <h3 className='elig-h3'>Do you live, work, worship, or attend school in one of our qualified census tracts?</h3>
      <p className='elig-p'>If so, you might be eligible for membership with us! Enter your address below to check and see if you qualify!</p>
      <form onSubmit={handleSubmit}>
        <label className='elig-label'>Street Address</label>
        <AddressBox className='elig-input' 
                    value={inputValue} placeholder='Enter your address here...' 
                    onChange={event => handleInputChange(event.target.value)} 
                    onPlaceChanged={handlePlaceChange} />
        <div className='elig-button-wrapper'>
          <button className='elig-button' type='submit'>Search Address</button>
          <button className={'elig-button elig-button-secondary'} type='button'
                  onClick={async () => {
                    if (!navigator.geolocation)
                      throw 'Geolocation API unavailable';
                    
                    const position = await getCurrentPosition();
                    const result = await lookupCoords({ 
                      lng: position.coords.longitude,
                      lat: position.coords.latitude,
                    })
                    console.log(result)
                    setApiResponse(result);
                  }}>
            <div className='elig-location-svg'></div>
            Use My Location
          </button>
        </div>
      </form>
      {renderEligibilityResponse()}
    </div>
  )
}

export default App;
