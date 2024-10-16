import { useState } from 'react';
import './App.css';

import EligibilityResponse from './components/EligibilityResponse';

type EligibilityResponseLoadingStates = "default" | "loading" | "complete" | "error";

function App() {
 
  const [inputValue, setInputValue] = useState<string>("Placeholder...");
  const [validResponse, setValidResponse] = useState<boolean>(false);
  const [eligibilityResponseLoadingState, setEligibilityResponseLoadingState] = useState<EligibilityResponseLoadingStates>("default");

  const handleInputChange = (newValue: string) => {
    console.log(newValue);
    setInputValue(newValue);
  }

  const handleSubmit = () => {
    setEligibilityResponseLoadingState("loading");
    // TBD: process response
    setValidResponse(true);
    setTimeout(function() {
      setEligibilityResponseLoadingState("complete");
      console.log("waiting");
    }, 500);
  }

  const renderEligibilityResponse = () => {
    switch(eligibilityResponseLoadingState) {
      case 'default':
        return <div>Try once loser</div>;
      case 'loading':
        return undefined; //stub
      case 'complete':
        return <EligibilityResponse isValid={validResponse} />
      case 'error':
        return undefined; //stub
    }
  }

  return (
    <>
      <h1>Harvard FCU Prototype</h1>
      <input type="text" value={inputValue} onChange={event => handleInputChange(event.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
      {renderEligibilityResponse()}
    </>
  )
}

export default App
