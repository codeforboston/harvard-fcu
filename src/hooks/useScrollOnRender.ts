// credits: codemzy.com
import React from 'react';

function useScrollOnRender() {
  const ref = React.useRef<null | HTMLHeadingElement>(null);
  
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return ref;
};

export default useScrollOnRender;