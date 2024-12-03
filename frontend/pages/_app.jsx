//import "@/public/assets/template/dist/css/fullcalendar.css"
import '../styles/globals.css'
import '@arcgis/core/assets/esri/themes/light/main.css';

import SEO from '@/contents/components/seo/Seo'
import { MantineProvider, rem } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { NavigationProgress } from '@mantine/nprogress';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { Poppins } from 'next/font/google'

const myFont = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});
function MyApp({ Component, pageProps }) {

  return <MantineProvider withNormalizeCSS withGlobalStyles theme={{
    fontFamily: myFont.style.fontFamily,
  }}>
    <NavigationProgress autoReset={true} zIndex={10000} />
    <Notifications position="top-right" zIndex={9999} />
    <ProfileProvider>
      <SEO/>
      <Component {...pageProps} />
    </ProfileProvider>
  </MantineProvider>
}

export default MyApp
