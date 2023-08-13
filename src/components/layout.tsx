import { useSession } from "next-auth/react";
import Header from "./header"
import { useEffect, type ReactNode } from "react"
import axios, { AxiosResponse } from "axios";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const { data: session } = useSession();

  useEffect(() => {
    (async () => {
      if (session) {
        try {
          const { data }: AxiosResponse<{message: string}> = await axios.post(
            '/api/auth/register', 
            {
              address: session.address
            }
          )
          console.log(data);
        }
        catch {
          console.log('exist');
        }
      }
    })();
  }, [session])

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}

