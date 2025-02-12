import * as React from "react";

type Props = React.PropsWithChildren<object>;

const NoAddressPageHeading: React.FC<Props> = () => {
  return (
    <>
      <h3 id='elig-h3'>It looks like the address you entered is invalid or incorrect. Re-enter your address to try again</h3>
      <div className='elig-wonder-svg'></div>
    </>
  )
}

export default NoAddressPageHeading;