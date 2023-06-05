import loadingWorldGif from "../assets/images/loadingpage/loadingWorld.gif";
import loadingCircle from "../assets/images/loadingpage/loadingCircle2.gif";
import "../styles/loadingPage.css";

function LoadingPage() {
    return (
        <div className="loading-container">
            <img src={loadingWorldGif} alt="Loading World" className="loading-world" />
            <img src={loadingCircle} alt="Loading Circle" className="loading-circle" />
        </div>
    );
}

export default LoadingPage;
