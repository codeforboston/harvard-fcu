import * as React from "react";
import useScrollOnRender from './hooks/useScrollOnRender';

type Props = React.PropsWithChildren<object>;

const ErrorPage: React.FC<Props> = () => {
  const headingRef = useScrollOnRender();
  return (
    <>
      <h3 id='elig-h3' ref={headingRef}>Oops</h3>
      <p className='elig-p'>An error occurred while processing your request. Please refresh the page and try again.</p>
    </>
  )
}

export default ErrorPage;