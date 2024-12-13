// const DefaultPage = () => {
// return (
//     <>
//     <h3 className='elig-h3'>Do you live, work, worship, or attend school in one of our qualified census tracts?</h3>
//     <p className='elig-p'>If so, you might be eligible for membership with us! Enter your address below to check and see if you qualify!</p>
//     <form onSubmit={handleSubmit}>
//       <label className='elig-label'>Street Address</label>
//       <AddressBox className='elig-input' 
//                   value={inputValue} placeholder='Enter your address here...' 
//                   onChange={event => handleInputChange(event.target.value)} 
//                   onPlaceChanged={handlePlaceChange} />
//       <div className='elig-button-wrapper'>
//         <button className='elig-button' type='submit'>Search Address</button>
//         <button className={'elig-button elig-button-secondary'} type='button'
//                 onClick={async () => {
//                   if (!navigator.geolocation)
//                     throw 'Geolocation API unavailable';
                  
//                   const position = await getCurrentPosition();
//                   const result = await lookupCoords({ 
//                     lng: position.coords.longitude,
//                     lat: position.coords.latitude,
//                   })
//                   console.log(result)
//                   setApiResponse(result);
//                 }}>
//           <div className='elig-location-svg'></div>
//           Use My Location
//         </button>
//       </div>
//     </form>
//     </>
// )
    
// }

// export default DefaultPage;