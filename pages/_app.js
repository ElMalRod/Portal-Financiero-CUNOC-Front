// pages/_app.js
import '../styles/global.css'; // Importa tus estilos globales

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
