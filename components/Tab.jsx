"use client";
import React from "react";
import Image from "next/image";
import { useSnapshot } from "valtio";

import state from "../store";
import { EditorTabs, FilterTabs } from "../config/constants";

const Tab = ({ tab, isFilterTab, isActiveTab, handleClick }) => {
  const snap = useSnapshot(state);

  const activeStyles =
    isFilterTab && isActiveTab
      ? { backgroundColor: snap.color, opacity: 0.5 }
      : { backgroundColor: "transparent", opacity: 1 };

  const isEditorTab = EditorTabs.includes(tab);
  const isFilterTabItem = FilterTabs.includes(tab);

  return (
    <div className="flex flex-col items-center">
      <div
        key={tab.name}
        className={isFilterTab ? "rounded-full glassmorphism tab-btn" : "flex flex-col items-center"}
        onClick={handleClick}
        style={activeStyles}
      >
        <Image
          src={tab.icon}
          alt={tab.name}
          width={isEditorTab ? 44 : "auto"}
          height={isEditorTab ? 44 : "auto"}
          className={isFilterTab ? "w-2/3 h-2/3" : "w-fit h-fit cursor-pointer select-none relative"}
        />
        {isEditorTab && (
          <div className="w-fit text-white  items-center justify-center mt-2 md:flex hidden">
            {tab.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tab;
