import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import Layout from '@/components/layout/Layout';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Session } from "next-auth"
import { WagmiConfig, createConfig, configureChains  } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import * as allChains from '@wagmi/core/chains'
 

const { publicClient } = configureChains(
  Object.values(allChains), 
  [publicProvider()]
);

const config = createConfig({
  autoConnect: false,
  publicClient,
});

export default function App({ 
  Component, 
  pageProps: { 
    session, 
    ...pageProps 
  } 
}: AppProps) {
  return (
    <WagmiConfig config={config}>
      <SessionProvider session={session}>
        <Layout>
          <ToastContainer
            position="top-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </WagmiConfig>
  )
}
