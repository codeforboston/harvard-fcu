// Importing the useState hook from React and the CSS file for styling
import { useState } from 'react';
import './App.css';

// Importing a component for displaying eligibility responses
import EligibilityResponse from './components/EligibilityResponse';
import { CensusApiResponse } from './types';

import { geocode } from './util/census';
import EligibleTracts from './data/tracts';

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


// Main App component
function App() {
  // State for input value, valid response status, and loading state of eligibility response
  const [inputValue, setInputValue] = useState<string>("");
  const [validResponse, setValidResponse] = useState<boolean>(false);
  const [eligibilityResponseLoadingState, setEligibilityResponseLoadingState] = useState<EligibilityResponseLoadingStates>("default");

  // Update the input value on text change
  const handleInputChange = (newValue: string) => {
    console.log(newValue); // Log new input value for debugging
    setInputValue(newValue); // Update state with the new input value
  }

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

      console.log(result); // Log result for debugging

      setValidResponse(!!findValidAddressForResult(result));
      // Navigate the JSON response structure to get the tract value

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
    <>
      <h1>Harvard FCU Prototype</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} placeholder='Enter Street Address' onChange={event => handleInputChange(event.target.value)} />
        <button type='submit'>Submit</button>
      </form>
      {renderEligibilityResponse()}
    </>
  )
}

export default App;