import Canvas from "../../../canvas";
import Customizer from "../../../section/Customizer";

import Navbar from "@/components/navbar";

function App() {
  return (
    <>
      <div className="relative z-10">
        <Navbar  />
      </div>
      <main className="app absolute md:bottom-11  bottom-16 transiton-all ease-in">
  
        <Canvas />
        <Customizer />
      </main>
    </>
  );
}

export default App;
