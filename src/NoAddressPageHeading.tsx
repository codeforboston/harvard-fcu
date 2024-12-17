import * as React from "react";

type Props = React.PropsWithChildren<object>;

const NoAddressPageHeading: React.FC<Props> = () => {
  return (
    <>
      <h3 className='elig-h3'>It looks like the address you entered is incorrect. Re-enter your address to try again</h3>
      <p className='elig-p'>{'(Image of a face with a raised eyebrow goes here)'}</p>
    </>
  )
}

export default NoAddressPageHeading;