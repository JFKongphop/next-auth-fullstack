import { getCsrfToken, signIn, useSession } from "next-auth/react"
import { SiweMessage } from "siwe"
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi"
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useEffect, useCallback } from "react"
import Layout from "@/components/layout"
import { useWalletClient } from 'wagmi'
import axios, { AxiosResponse } from "axios"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from 'react-toastify';

interface IVerifyEmail {
  email: string;
}

const defaultValues = {
  email: ''
}

function Siwe() {
  const { signMessageAsync } = useSignMessage()
  const { chain } = useNetwork()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { data: session, status } = useSession()
  const { data: walletClient } = useWalletClient()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IVerifyEmail>({defaultValues});

  const handleLogin = useCallback(async () => {
    try {
      const callbackUrl = "/protected"
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      })
    } 
    catch (error) {
      window.alert(error)
    }
  }, [address, chain?.id, signMessageAsync]);

  useEffect(() => {
    if (isConnected && !session) {
      handleLogin()
    }
  }, [handleLogin, isConnected, session]);

  const onSubmit: SubmitHandler<IVerifyEmail> = async ({ email }) => {
    try {
      const { data }: AxiosResponse<{ message: string }> = await axios.post(
        '/api/auth/submit-email',
        {
          email,
          address: session?.address
        }
      )
      toast.success(data.message)
    }
    catch (error: any) {
      toast.error(error.response.data.message)
    }
  }
  

  return (
    <Layout>
      <button
        onClick={(e) => {
          e.preventDefault()
          if (!isConnected) {
            connect()
          } else {
            handleLogin()
          }
        }}
      >
        Sign-in
      </button>
      {
        session && (
          <div className="w-full flex justify-center items-center mt-10">
            <div className="w-1/2 h-[300px] flex flex-col gap-4">
              <label className="w-full text-center">Verify Your Email</label>
              <input
                type="email"
                className="border rounded p-2 focus:outline-none"
                placeholder="Enter your email"
                {...register('email', {
                  required: true
                })}
              />
              <div className="w-full flex justify-center items-center">
                <button 
                  className="h-10 w-1/2 border"
                  onClick={handleSubmit(onSubmit)}
                >
                  Submit
                </button>
              </div>
              <div className="flex justify-center">
                {errors.email && <p>Please enter your email</p>}
              </div>
            </div>
          </div>
        )
      }
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}

Siwe.Layout = Layout

export default Siwe