import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import World3D from './map/3dmap';
import World2D from './map/2dmap';
import Card from './components/card';

import World2DImage from './assets/images/modImages/2dmap.png';
import World3DImage from './assets/images/modImages/3dmap.png';

function App() {
  return (
    <Router>
      <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-blue-500 min-h-screen flex justify-center items-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/World2DMap" element={<World2D />} />
          <Route path="/World3DMap" element={<World3D />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  // eslint-disable-next-line no-unused-vars
  const location = useLocation();

  return (
    <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6 sm:pt-8 sm:pb-8 mt-32 mb-24">
      <Card
        title="2D WORLD"
        imageUrl={World2DImage}
        imageAlt="Earth 2D"
        description="Continue with 2D WORLD"
        mapMod="World2DMap"
      />
      <Card
        title="3D WORLD"
        imageUrl={World3DImage}
        imageAlt="Earth 3D"
        description="Continue with 3D WORLD"
        mapMod="World3DMap"
      />
    </div>
  );
}

export default App;
