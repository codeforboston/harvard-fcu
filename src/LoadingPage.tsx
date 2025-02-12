import * as React from "react";

import LoadingImage from '../assets/loading.gif';

type Props = React.PropsWithChildren<object>;

const LoadingPage: React.FC<Props> = () => {
  return (
    <div className="loading">
      <img src={LoadingImage} />
    </div>
  )
}

export default LoadingPage;