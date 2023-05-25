/* Button to signin or signup from social media platform */

import { signIn } from 'next-auth/react';
import React from 'react';
import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaGoogle,
  FaSpotify,
  FaTwitter,
} from "react-icons/fa";
import { SiAuth0 } from "react-icons/si";

const colors: any = {
  google: "#DB4437",
  facebook: "#4285F4",
  auth0: "#eb5424",
  github: "#333",
  discord: "#7289da",
  spotify: "#1DB954",
  twitter: "#1DA1F2",
};

// direct to sign in account

interface ISocialButton {
  id: string;
  text: string;
  csrfToken: string;
}

const SocialButton: React.FC<ISocialButton> = ({
  id,
  text,
  csrfToken
}) => {
  const createIconJsx = () => {
    switch (id) {
      case "google":
        return <FaGoogle />;
      case "facebook":
        return <FaFacebook />;
      case "auth0":
        return <SiAuth0 />;
      case "github":
        return <FaGithub />;
      case "discord":
        return <FaDiscord />;
      case "spotify":
        return <FaSpotify />;
      case "twitter(Leagcy)":
        return <FaTwitter />;
      default:
        return;
    }
  };

  return (
    <form 
      method="post"
      action={`/api/auth/signin/${id}`}
    >
      <input 
        type="hidden" 
        name="csrfToken"
        defaultValue={csrfToken}
      />
      <button 
        type="button"
        onClick={() => signIn(id)}
        style={{ background: `${colors[id]}` }}
        className="
          mb-2 py-2 px-4 flex justify-center items-center 
          gap-2 hover:bg-gray-700 focus:ring-gray-500 
          focus:ring-offset-gray-200 text-white w-full 
          transition ease-in duration-200 text-center 
          text-base font-semibold shadow-md focus:outline-none 
          focus:ring-2 focus:ring-offset-2 rounded-md
        "
      >
        {createIconJsx()}
        {text}
      </button>
    </form>
  )
}

export default SocialButton