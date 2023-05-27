/* Main page of user account */

import { NextPageContext } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { SiUdemy } from "react-icons/si";
import { AiFillGithub } from "react-icons/ai";
import { text1, text2 } from "@/asset/text";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";

type DataResponse = {
  message: string;
  token: string;
}

export default function Home() {
  const { data: session } = useSession();
  // console.log(session)

  const router = useRouter();

  const editProfileHandler = async () => {
    try {
      const { data } = await axios.post<DataResponse>(
        '/api/edit/edit-redirect', { 
        email: session?.user.email 
      });

      router.push(`/edit/${data.token}`);
    }
    catch {
      toast.error('Cannot edit profile')
    }
  }

  const editStatus: boolean = session?.user.provider === 'credentials';

  return (
    <div 
      className="
          home bg-black min-h-screen text-white
          flex items-center justify-center
        "
      >
      <div className="container mx-auto">
        <div 
          className="
            border border-white relative 
            flex flex-col w-full rounded-lg
          "
        >
          <div className="flex flex-wrap justify-center items-center">
            <div className={`${!editStatus && 'text-right'} w-full`}>
              <div className={`py-3 px-3  ${editStatus && 'flex justify-between'}`}>
                {editStatus && (<button
                  className="
                    bg-blue-500 hover:bg-blue-700 text-md 
                    uppercase font-bold px-8 py-2 rounded-md 
                    mb-1 ease-linear transition-all 
                    duration-150
                  "
                  onClick={editProfileHandler}
                >
                  Edit Profile
                </button>)}
                <button
                  className="
                    bg-red-500 hover:bg-red-700 text-md 
                    uppercase font-bold px-8 py-2 rounded-md 
                    mb-1 ease-linear transition-all 
                    duration-150
                  "
                  onClick={() => signOut()}
                >
                  Log out
                </button>
              </div>
            </div>
            <div className="w-full flex justify-center">
              <img
                src={session?.user?.image!}
                alt={`${session?.user?.name} image`}
                className="rounded-full h-40 w-40"
              />
            </div>
            <div className="text-center mt-12">
              <h3 className="text-4xl font-semibold mb-2">
                {session?.user?.name}
              </h3>
              <div className="text-sm mb-2 font-bold">
                {session?.user?.email}
              </div>
              <div className="mb-2 mt-10">
                You logged in using &nbsp;
                <span 
                  className="
                    capitalize bg-blue-400 text-white px-4 py-1 
                    ml-2 font-bold italix text-lg rounded-md
                  "
                >
                  {session?.user?.provider}
                </span>
              </div>
            </div>
            <div className="mt-5 py-10 border-t text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4">
                  <p className="mb-4 text-sm">{text1}</p>
                  <p className="font-bold text-xs">{text2}</p>
                  <div className="mt-6 flex items-center justify-center gap-2">
                    Source code here : &nbsp;
                    <a
                      href="http://"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-4xl"
                    >
                      <AiFillGithub />
                    </a>
                  </div>
                  <div className="flex justify-center gap-4  mt-4 pt-6 text-3xl ">
                    <a
                      href=""
                      target="_blank"
                      className="hover:scale-125 transition ease-in-out"
                    >
                      <AiFillGithub />
                    </a>
                    <a
                      href=""
                      target="_blank"
                      className="hover:scale-125 transition ease-in-out"
                    >
                      <FaInstagram />
                    </a>
                    <a
                      href=""
                      target="_blank"
                      className="hover:scale-125 transition ease-in-out"
                    >
                      <FaYoutube />
                    </a>
                    <a
                      href=""
                      target="_blank"
                      className="hover:scale-125 transition ease-in-out"
                    >
                      <FaFacebook />
                    </a>
                    <a
                      href=""
                      target="_blank"
                      className="hover:scale-125 transition ease-in-out"
                    >
                      <FaLinkedin />
                    </a>
                    <a
                      href=""
                      target="_blank"
                      className="hover:scale-125 transition ease-in-out"
                    >
                      <SiUdemy />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps (ctx: NextPageContext) {
  const session = await getSession(ctx);

  return {
    props: {
      session
    },
  }
}
