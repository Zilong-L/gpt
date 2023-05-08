import "@/styles/globals.css";
import type { AppProps } from "next/app";
import ThemeProvider from "components/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider>
            <ToastContainer />
            <Component {...pageProps} />
        </ThemeProvider>
    );
}
