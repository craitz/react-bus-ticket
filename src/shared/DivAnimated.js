import React from 'react';

const DivAnimated = ({ children, className }) =>
  <div className={`${className} animated bounceInLeft`}>
    {children}
  </div>

export default DivAnimated;