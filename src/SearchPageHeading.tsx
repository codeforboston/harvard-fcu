import * as React from "react";

type Props = React.PropsWithChildren<object>;

const SearchPageHeading: React.FC<Props> = () => {
  return (
    <>
      <h3 className='elig-h3'>Do you live, work, worship, or attend school in one of our qualified census tracts?</h3>
      <p className='elig-p'>If so, you might be eligible for membership with us! Enter your address below to check and see if you qualify!</p>
    </>
  )
}

export default SearchPageHeading;