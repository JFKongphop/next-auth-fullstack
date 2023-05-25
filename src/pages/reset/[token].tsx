/* Reset password page */

import Background from '@/components/backgrounds/Background';
import ResetForm from '@/components/forms/Reset';
import { NextPageContext } from 'next';
import React from 'react';


const Reset = ({ 
  token
} : {
  token: string;
}) => {
  return (
    <div className="w-full items-center justify-center">
      <div className="w-full h-100 flex item-center justify-center">
        <div 
          className="
            bg-white flex flex-col items-center justify-center
          "
        >          
         <ResetForm token={token} />
        </div>
        <Background 
          image={`../../auth/reset.jpg`} 
        />
      </div>
    </div>
  )
}

export default Reset;

export async function getServerSideProps(ctx: NextPageContext) {
  const { query } = ctx;
  const token = query.token;
  console.log(token)
  return {
    props: {
      token
    }
  }
}
