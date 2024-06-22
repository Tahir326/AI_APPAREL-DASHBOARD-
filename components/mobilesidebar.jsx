import React, { useState, useRef, useEffect } from "react";
import state from "../store";
import { EditorTabs } from "../config/constants";
import { DecalTypes } from "../config/constants";
import AIPicker from "../components/AIPicker";
import ColorPicker from "../components/ColorPicker";
import FilePicker from "../components/FilePicker";
import MobileTab from "./mobiletab";
import { reader } from "../config/helpers";

const SidebarMb = () => {
    const [file, setFile] = useState("");
    const [prompt, setPrompt] = useState("");
    const [generatingImg, setGeneratingImg] = useState(false);
    const [activeEditorTab, setActiveEditorTab] = useState("");
    const [activeFilterTab, setActiveFilterTab] = useState({
      logoShirt: true,
      stylishShirt: false,
    });

  
    const editorTabsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (
            event.target.closest(".editortabs-container") === null &&
            activeEditorTab !== ""
          ) {
            setActiveEditorTab("");
          }
        };
    
        document.addEventListener("click", handleClickOutside);
    
        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
      }, [activeEditorTab]);
    

    const generateTabContent = () => {
      switch (activeEditorTab) {
        case "Change Colour":
          return <ColorPicker />;
        case "Upload File":
          return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
        case "Generate AI Image":
          return (
            <AIPicker
              prompt={prompt}
              setPrompt={setPrompt}
              generatingImg={generatingImg}
              handleSubmit={handleSubmit}
            />
          );
        default:
          return null;
      }
    };
  
    const handleSubmit = async (type) => {
      if (!prompt) return alert("Please enter a prompt");
  
      try {
        setGeneratingImg(true);
  
        const response = await fetch("http://localhost:8080/api/v1/dalle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });
  
        const data = await response.json();
        handleDecals(type, `data:image/png;base64,${data.photo}`);
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false);
        setActiveEditorTab("");
      }
    };
  
    const handleDecals = (type, result) => {
      const decalType = DecalTypes[type];
      state[decalType.stateProperty] = result;
  
      if (!activeFilterTab[decalType.filterTab]) {
        handleActiveFilterTab(decalType.filterTab);
      }
    };
  
    const handleActiveFilterTab = (tabName) => {
      switch (tabName) {
        case "logoShirt":
          state.isLogoTexture = !activeFilterTab[tabName];
          break;
        case "stylishShirt":
          state.isFullTexture = !activeFilterTab[tabName];
          break;
        default:
          state.isFullTexture = true;
          state.isLogoTexture = false;
          break;
      }
  
      setActiveFilterTab((prevState) => ({
        ...prevState,
        [tabName]: !prevState[tabName],
      }));
    };
  
    const readFile = (type) => {
      reader(file).then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      });
    };
  
  
  return (
    <>
      <main className="flex items-center min-h-screen md:hidden ">
        <div className="editortabs-container tabs">
          {EditorTabs.map((tab) => (
            <MobileTab
              key={tab.name}
              tab={tab}
              handleClick={() => setActiveEditorTab(tab.name)}
            />
          ))}

          {generateTabContent()}
        </div>
      </main>
    </>
  );
};

export default SidebarMb;
