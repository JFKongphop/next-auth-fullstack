/* For register or login page */

import Background from '@/components/backgrounds/Background';
import SocialButton from '@/components/button/SocialButton';
import LoginForm from '@/components/forms/Login';
import RegisterForm from '@/components/forms/Register';
import { NextPageContext } from 'next';
import { getCsrfToken, getProviders } from 'next-auth/react';
import React from 'react';

type Provider = {
  callbackUrl: string;
  id: string;
  name: string;
  signinUrl: string;
  type: string;
}

const Auth = ({ 
  tab, 
  callbackUrl,
  csrfToken,
  providers,
}: { 
  tab: string;
  callbackUrl: string;
  csrfToken: string;
  providers: Provider[]
}) => {
  return (
    <div className="w-full items-center justify-center">
      <div className="w-full h-100 flex item-center justify-center">
        <div 
          className="
            bg-white flex flex-col items-center justify-center
          "
        >          
          {tab === 'signin' ? (
            <LoginForm
              callbackUrl={callbackUrl}
              csrfToken={csrfToken}
            />
          ) : (
            <RegisterForm />
          )}
          <div className="w-full flex items-center justify-between">
            <div className="w-full h-[1px] bg-gray-300"></div>
            <span className="text-sm uppercase mx-6 text-gray-400">Or</span>
            <div className="w-full h-[1px] bg-gray-300"></div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {
              providers.map((provider: Provider) => {
                if (provider.name === 'Credentials') return;
                return (
                  <SocialButton 
                    key={provider.id}
                    id={provider.id}
                    text={`Sign ${tab === 'signup' ? 'up' : 'in'} ${provider.name}`}
                    csrfToken={csrfToken}
                  />
                )
              })
            }
          </div>
        </div>
        <Background 
          image={`../../auth/${tab === 'signin' ? 'login': 'register'}.jpg`} 
        />
      </div>
    </div>
  )
}

export default Auth;

export async function getServerSideProps(ctx: NextPageContext) {
  const { req, query } = ctx;
  const tab = query.tab ? query.tab : 'signin';
  const callbackUrl = query.callbackUrl 
    ? query.callbackUrl 
    : process.env.NEXTAUTH_URL;
  const csrfToken = await getCsrfToken(ctx);
  const providers = await getProviders(); // show all provider

  return {  
    props: { 
      tab,
      callbackUrl,
      csrfToken,
      providers: Object.values(providers!)
    }
  };
}