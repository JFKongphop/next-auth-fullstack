/* Activate page to show status of user are activate the account yet */

import axios from "axios";
import { NextPageContext } from "next";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";

// send the token go back to this page for activate account
export default function activate({ token }: { token: string; }) {
  // set the message from path activate
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // send the token to activate account
  const activateAccount = async () => {
    try {
      const { data } = await axios.put('/api/auth/activate', { token });
      setSuccess(data.message);
    }
    catch (error: any) {
      setError((error?.response?.data).message);
    }
  };

  useEffect(() => { 
    activateAccount();
  }, [token]);

  return (
    <div className="bg-black h-screen flex items-center justify-center">
      {
        error && (
          <div className="flex flex-col justify-center items-center">
            <p className="text-red-500 text-xl font-bold">{error}</p>
            <button
              className="
                bg-blue-500 hover:bg-blue-700 text-md 
                uppercase font-bold px-8 py-2 rounded-md 
                sm:mr-2 mb-1 ease-linear transition-all 
                duration-150 text-white mt-4
              "
              onClick={() => signIn()}
            >
              Sign In
            </button>
          </div>
        )
      }
      {
        success && (
          <div className="flex flex-col justify-center items-center">
            <p className="text-green-500 text-xl font-bold">{success}</p>
            <button
              className="
                bg-blue-500 hover:bg-blue-700 text-md 
                uppercase font-bold px-8 py-2 rounded-md 
                sm:mr-2 mb-1 ease-linear transition-all 
                duration-150 text-white mt-4
              "
              onClick={() => signIn()}
            >
              Sign In
            </button>
          </div>
        )
      }
    </div>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  // get the activateToken from the url
  const { query }  = ctx;
  const token = query.token;
  
  // console.log(token);
  return {
    props: {
      token
    }
  }
}