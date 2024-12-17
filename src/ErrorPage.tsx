import * as React from "react";

type Props = React.PropsWithChildren<object>;

const ErrorPage: React.FC<Props> = () => {
  return (
    <>
      <h3 className='elig-h3'>Oops</h3>
      <p className='elig-p'>An error occurred while processing your request. Please refresh the page and try again.</p>
    </>
  )
}

export default ErrorPage;