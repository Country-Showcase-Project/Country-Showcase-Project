import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Card from './components/card';

import LoadingPage from "./pages/loadingPage"
import NotFound from "./pages/pageNotFound"

import logoImage from "./assets/images/logo.png"
import World2DImage from './assets/images/modImages/2dmap.png';
import World3DImage from './assets/images/modImages/3dmap.png';

const World2D = lazy(() => import('./map/2dmap'));
const World3D = lazy(() => import('./map/3dmap'));

function App() {
  return (
    <Router>
      <div className="bg-gradient-to-br from-green-500 via-gray-500 to-blue-500 min-h-screen flex justify-center items-center">
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/World2DMap" element={<World2D />} />
            <Route path="/World3DMap" element={<World3D />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}


function Home() {
  return (
    <div className="flex flex-col items-center mt-6 mb-2">
      <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6 sm:pt-8 sm:pb-8">
        <img src={logoImage} alt="Logo" className="max-w-full h-auto" />
      </div>
      <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6 sm:pt-8 sm:pb-8">
        <Suspense fallback={<LoadingPage />}>
          <Card
            title="2D WORLD"
            imageUrl={World2DImage}
            imageAlt="Earth 2D"
            description={
              <>
                Continue with 2D WORLD
                <br />
                (Recommended for all systems)
              </>
            }
            mapMod="World2DMap"
          />
          <Card
            title="3D WORLD"
            imageUrl={World3DImage}
            imageAlt="Earth 3D"
            description={
              <>
                Continue with 3D WORLD
                <br />
                (Not recommended for low systems)
              </>
            }
            mapMod="World3DMap"
          />
        </Suspense>
      </div>
    </div>

  );
}

export default App;


