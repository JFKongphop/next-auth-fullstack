/* Right backgound */

import React from 'react';

interface IBackground {
  image: string;
}

const Background: React.FC<IBackground> = ({ image }) => {
  return (
    <div 
      className="
        hidden min-h-screen lg:flex lg:w-1/2 xl:w-2/3 
        2xwl:w-3/4 bg-contain bg-no-repeat bg-center
        justify-center text-center
      "
      style={{
        backgroundImage: `url(${image})`
      }}
    >
    </div>
  )
}

export default Background