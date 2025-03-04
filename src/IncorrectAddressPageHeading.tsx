import * as React from "react";
import useScrollOnRender from './hooks/useScrollOnRender';

type Props = React.PropsWithChildren<object>;

const NoAddressPageHeading: React.FC<Props> = () => {
  const headingRef = useScrollOnRender();
  return (
    <>
      <h3 id='elig-h3' ref={headingRef}>It looks like the address you entered is invalid or incorrect. Re-enter your address to try again</h3>
      <div className='elig-wonder-svg'></div>
    </>
  )
}

export default NoAddressPageHeading;