import 'bootstrap/dist/css/bootstrap.css';
import { buildClient } from '../api/build-client'
import App from 'next/app';
import Header from '../components/header';

const MyApp = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser}/>
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  );
};

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  const { data } = await buildClient(appContext.ctx).get('/api/users/currentuser');
  return { ...appProps, ...data };
}

export default MyApp;