// Importing the useState hook from React and the CSS file for styling
import { useState } from 'react';
import './App.css';

// Importing a component for displaying eligibility responses
import EligibilityResponse from './components/EligibilityResponse';

// Census Geocoding API URLs for reference
// https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress
// https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html

const eligibleTracts = ["25009202104","25009205200","25009205500","25009205600","25009205700","25009205800","25009205900","25009206000","25009206100","25009206200","25009206400","25009206500","25009206600","25009206700","25009206800","25009206900","25009207000","25009207100","25009207200","25009208301","25009208302","25017336404","25017339101","25017339700","25017339900","25017341200","25017341301","25017341400","25017341500","25017341600","25017341700","25017341800","25017341901","25017341904","25017342101","25017342102","25017342201","25017342202","25017342301","25017342302","25017342401","25017342402","25017342501","25017342502","25017342600","25017350106","25017350107","25017350108","25017350109","25017351203","25017351403","25017351404","25017351500","25017352101","25017352102","25017352200","25017352300","25017352400","25017352500","25017352600","25017352700","25017352800","25017352900","25017353000","25017353101","25017353102","25017353200","25017353300","25017353700","25017353800","25017353900","25017354000","25017354100","25017357400","25017359400","25017370201","25017370301","25017370302","25017370403","25017373100","25021400100","25021400202","25025000102","25025000201","25025000202","25025000301","25025000302","25025000401","25025000502","25025000503","25025000505","25025000506","25025000603","25025000604","25025000701","25025000703","25025000704","25025000805","25025000806","25025000807","25025010103","25025010104","25025010204","25025010205","25025010206","25025010300","25025010403","25025010404","25025010405","25025010408","25025010500","25025020301","25025020304","25025030301","25025030302","25025040200","25025040600","25025040801","25025050101","25025050200","25025050300","25025050400","25025050500","25025050600","25025050700","25025050901","25025051000","25025051101","25025060603","25025060604","25025060700","25025061000","25025061101","25025061201","25025061203","25025070102","25025070103","25025070201","25025070202","25025070402","25025070502","25025070600","25025070801","25025070802","25025070901","25025070902","25025071101","25025071201","25025080100","25025080300","25025080401","25025080500","25025080601","25025080801","25025080900","25025081001","25025081101","25025081102","25025081200","25025081301","25025081302","25025081400","25025081500","25025081700","25025081800","25025081900","25025082000","25025082100","25025090100","25025090200","25025090300","25025090400","25025090600","25025090700","25025090901","25025091001","25025091100","25025091200","25025091300","25025091400","25025091500","25025091600","25025091700","25025091800","25025091900","25025092000","25025092101","25025092200","25025092300","25025092400","25025100100","25025100200","25025100300","25025100400","25025100500","25025100601","25025101001","25025101002","25025101101","25025101102","25025110104","25025110201","25025110301","25025110401","25025110403","25025120500","25025130406","25025140102","25025140105","25025140106","25025140300","25025140400","25025160102","25025160103","25025160200","25025160300","25025160400","25025160501","25025160502","25025160601","25025160602","25025170101","25025170102","25025170200","25025170301","25025170302","25025170400","25025170502","25025170503","25025170504","25025170601","25025170701","25025170702","25025170800","25025180101","25025980300","25025981501","25025981502","25025981800"];

// Set default parameters for the Census API request
const params = {
    'address': '55 Massachusetts Avenue Cambridge MA', // Initial address for testing
    'benchmark': 'Public_AR_Census2020',               // Use the 2020 Census benchmark
    'vintage': 'Census2020_Census2020',                // Census 2020 vintage data
    'layers': 'tract',                                 // Specify layers for census tract
    'format': 'jsonp',                                 // Request JSONP format
    'callback': 'randomname_xxxx'                      // Custom callback function for JSONP
}

// Helper function to encode URL query parameters from an object
function encodeQueryParams(params: Record<string, string>) {
  return Object.entries(params).map(([key, val]) => (
    key + '=' + encodeURIComponent(val)
  )).join('&');
}

// Define loading states for the eligibility response component
type EligibilityResponseLoadingStates = "default" | "loading" | "complete" | "error";

// Utility function to simulate delay (using a Promise) for testing purposes
function wait(ms: number) {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, ms);
  }).catch(e => {
    return 'default-value';
  })
}

// Define parameters for loading JSONP data
type LoadJsonpParams = {
  jsonpParam?: string, // Optional JSONP parameter
}

// Function to load JSONP data, creating a script tag and defining a global callback
function loadJsonp(url: string): Promise<any> {
  const functionName = 'randomname_xxxx'; // JSONP callback function name
  return new Promise((resolve, reject) => {
    (window as any)[functionName] = function(result: any) { 
      resolve(result); // Resolve the promise with the result on success
    }
    const script = document.createElement("script"); // Create script element
    script.src = url; // Set URL as script source
    script.onerror = (e) => { reject(e); }; // Reject promise if loading fails
    document.head.appendChild(script); // Append script to document head
  })
}

// Main App component
function App() {
  // State for input value, valid response status, and loading state of eligibility response
  const [inputValue, setInputValue] = useState<string>("Placeholder...");
  const [validResponse, setValidResponse] = useState<boolean>(false);
  const [eligibilityResponseLoadingState, setEligibilityResponseLoadingState] = useState<EligibilityResponseLoadingStates>("default");

  // Update the input value on text change
  const handleInputChange = (newValue: string) => {
    console.log(newValue); // Log new input value for debugging
    setInputValue(newValue); // Update state with the new input value
  }

  // Handle the form submission for geocoding request
  const handleSubmit = async () => {
    setEligibilityResponseLoadingState("loading"); // Set loading state
    params.address = inputValue; // Update params with user-provided address

    // Construct URL with encoded parameters and load JSONP data
    // Define the callback function randomname_xxxx on window['randomname_xxxx]
    // Create script tag, w/ src, crossorigin, onerror
    //    src = url + format=jsonp, callback=
    // Insert script into head (or update virtual script element)

    const url = "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?" + encodeQueryParams(params);
    const result = await loadJsonp(url);
    console.log(result); // Log result for debugging

    // Navigate the JSON response structure to get the tract value
    const addressMatches = result.result.addressMatches;

    // Check if there is at least one address match and that it contains Census Tract information
    if (addressMatches && addressMatches.length > 0) {
        const tractData = addressMatches[0].geographies["Census Tracts"];
        
        // Verify that Census Tract information is available
        if (tractData && tractData.length > 0) {
            const tractValue = tractData[0].GEOID;
            
            // Check if the tractValue is in the eligible tracts list
            const isValidTract = eligibleTracts.includes(tractValue);
            setValidResponse(isValidTract);
        } else {
            // Set to invalid if Census Tract information is missing
            setValidResponse(false);
        }
    } else {
        // Set to invalid if no address matches found
        setValidResponse(false);
    }

    setTimeout(function() { // Delay for UX effect
      setEligibilityResponseLoadingState("complete");
      console.log("waiting"); // Debugging log
    }, 500);
  }

  // Render different eligibility response states based on loading state
  const renderEligibilityResponse = () => {
    switch(eligibilityResponseLoadingState) {
      case 'default':
        return <div>Try once loser</div>; // Default message
      case 'loading':
        return undefined; // Loading state placeholder
      case 'complete':
        return <EligibilityResponse isValid={validResponse} /> // Show eligibility response
      case 'error':
        return undefined; // Error state placeholder
    }
  }

  // Render main application with input, submit button, and eligibility response
  return (
    <>
      <h1>Harvard FCU Prototype</h1>
      <input type="text" value={inputValue} onChange={event => handleInputChange(event.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
      {renderEligibilityResponse()}
    </>
  )
}

export default App;