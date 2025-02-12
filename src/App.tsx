import { useState } from 'react';
import { EligibilityAppStates } from './types';
import './App.css';

import SearchPage from './SearchPage';
import EligiblePage from './EligiblePage';
import NotEligiblePage from './NotEligiblePage';
import LoadingPage from './LoadingPage';
import ErrorPage from './ErrorPage';
import IncorrectAddressPageHeading from './IncorrectAddressPageHeading';
import SearchPageHeading from './SearchPageHeading';

// Main App component
function App() {
  const [eligibilityAppState, setEligibilityAppState] = useState<EligibilityAppStates>("search");

  const renderPage = () => {
    switch (eligibilityAppState) {
      case 'search':
        return <>
          <SearchPageHeading/>
          <SearchPage setPageState={setEligibilityAppState}/>
        </>
      case 'loading':
        return <>
          <SearchPageHeading/>
          <LoadingPage/>
        </>
      case 'incorrect_address':
        return <>
          <IncorrectAddressPageHeading/>
          <SearchPage setPageState={setEligibilityAppState}/>
        </>
      case 'eligible':
        return <EligiblePage/>
      case 'not_eligible':
        return <NotEligiblePage setPageState={setEligibilityAppState} />
      case 'error':
        return <ErrorPage/>
      default:
        return <h1>Did not match any component</h1>
    }
  }

  // Render main application
  return (
    <div className='eligibilityBox'>
      {renderPage()}
    </div>
  )
}

export default App;
