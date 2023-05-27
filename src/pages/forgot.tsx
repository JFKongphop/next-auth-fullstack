/* Forgot account page */

import Background from '@/components/backgrounds/Background';
import ForgotForm from '@/components/forms/Forgot';
import { useSession } from 'next-auth/react';
import React from 'react';


const Forgot = ({ }) => {
  const { data: session } = useSession();
  console.log(session)
  return (
    <div className="w-full items-center justify-center">
      <div className="w-full h-100 flex item-center justify-center">
        <div 
          className="
            bg-white flex flex-col items-center justify-center
          "
        >          
         <ForgotForm />
        </div>
        <Background 
          image={`../../auth/reset.jpg`} 
        />
      </div>
    </div>
  )
}

export default Forgot;
