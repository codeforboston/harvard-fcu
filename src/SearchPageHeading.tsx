import * as React from "react";

type Props = React.PropsWithChildren<object>;

const SearchPageHeading: React.FC<Props> = () => {
  return (
    <>
      <h3 id='elig-h3'>Do you live, work, worship, or attend school in one of our qualified census tracts?</h3>
      <p className='elig-p'>If so, that would qualify you for membership! Enter your address below to check and see if you qualify!</p>
    </>
  )
}

export default SearchPageHeading;