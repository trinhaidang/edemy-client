import TopNav from "../components/TopNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../public/css/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ContextProvider } from "../context";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <ContextProvider>
                <ToastContainer position="top-center" />
                <TopNav />
                <Component {...pageProps} />
            </ContextProvider>
        </>
    );
}

export default MyApp;