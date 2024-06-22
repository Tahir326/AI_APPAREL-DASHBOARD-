"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Montserrat } from "next/font/google";
import state from "../store";
import { reader } from "../config/helpers";
import { EditorTabs } from "../config/constants";
import { DecalTypes } from "../config/constants";
import AIPicker from "../components/AIPicker";
import ColorPicker from "../components/ColorPicker";
import FilePicker from "../components/FilePicker";
import Tab from "../components/Tab";
import { Button } from "@/components/ui/button";
import { Sidebar as SidebarIcon, ChevronLeft, ChevronRight } from "lucide-react";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const Sidebar1 = () => {
  const [file, setFile] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const editorTabsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editorTabsRef.current && !editorTabsRef.current.contains(event.target)) {
        setActiveEditorTab("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <div className="relative h-full">
      <div className="hidden md:block">
        <div
          className={`bg-gray-900 rounded-tr-lg rounded-br-lg h-full flex flex-col justify-between items-center pb-7 fixed transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:w-64`}
        >
          <div className="md:w-64 py-5 gap-4">
            <Link href="/dashboard" className="md:flex items-center ml-8">
              <div className="relative w-8 h-8">
                <Image fill alt="Logo" src="/logo.png" />
              </div>
              <h1 className={cn("text-2xl ml-3 text-white font-bold", montserrat.className)}>
                AI APPAREL
              </h1>
            </Link>
          </div>

          <div ref={editorTabsRef} className="md:flex flex-col mb-16 justify-center items-center py-4 gap-4 md:w-64">
            {EditorTabs.map((tab) => (
              <Tab key={tab.name} tab={tab} handleClick={() => setActiveEditorTab(tab.name)} />
            ))}
            {generateTabContent()}
          </div>

          <Link href="#">
            <Button className="rounded-2xl bg-sky-500 cursor-pointer">
              Order Now
            </Button>
          </Link>
        </div>
        <button
          className={`absolute top-[20.5rem] transform -translate-y-1/2  text-white p-2 rounded-tr-full rounded-br-full hidden md:flex transition-transform ${
            isSidebarOpen ? "left-52 bg-gray-900" : "left-0 glassmorphism  "
          }`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <ChevronLeft  /> : <ChevronRight className="text-gray-900"  />}
        </button>
      </div>

     
    </div>
  );
};

export default Sidebar1;
