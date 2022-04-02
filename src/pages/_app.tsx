import '../styles/global.scss'
import type { AppProps } from 'next/app'
import { Header } from '../components/Header';
import { SessionProvider } from 'next-auth/react';
import {ToggleMenuProvider} from '../contexts/ToggleMenuContexts'
import { ToggleMenu } from '../components/ToggleMenu';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.section}>
      <ToggleMenuProvider>
        <Header />
        <ToggleMenu/>
        <Component {...pageProps} />
      </ToggleMenuProvider>
      </SessionProvider >

  );
}

export default MyApp
