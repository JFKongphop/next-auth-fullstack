import React from 'react';

interface INavbar {
  email: string;
}

const Navbar: React.FC<INavbar> = ({ email }) => {
  return (
    <>
      {/* <nav className="text-red-500 text-4xl bg-yellow-300">
        <h1>{email || 'welcome to next auth'}</h1>
      </nav> */}
    </>
  )
}

export default Navbar