"use client";
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage } from "../config/helpers";
import { FilterTabs } from "../config/constants";
import { slideAnimation } from "../config/motion";
import Tab from "../components/Tab";
import Sidebar1 from "../components/sidebar";
import SidebarMb from "../components/mobilesidebar";



const Customizer = () => {
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
        editorTabsRef.current &&
        !editorTabsRef.current.contains(event.target)
      ) {
        setActiveEditorTab("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return (
    <AnimatePresence>
      <>
        <motion.div
          key="custom"
          className="absolute top-0 left-0 z-20"
          {...slideAnimation("up")}
        >
          <Sidebar1 />
          <SidebarMb />
        </motion.div>

        <motion.div
          className="filtertabs-container relative z-10"
          {...slideAnimation("up")}
        >
          {FilterTabs.map((tab) => (
            <Tab
              key={tab.name}
              tab={tab}
              isFilterTab
              isActiveTab={activeFilterTab[tab.name]}
              handleClick={() => handleActiveFilterTab(tab.name)}
            />
          ))}
          <button className="download-btn" onClick={downloadCanvasToImage}>
            <Image
              src={download}
              alt="download_image"
              className="w-3/5 h-3/5 object-contain"
            />
          </button>
        </motion.div>
      </>
    </AnimatePresence>
  );
};

export default Customizer;
