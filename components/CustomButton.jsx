"use client";
import React from "react";
import { useSnapshot } from "valtio";

import state from "../store";
import { getContrastingColor } from "../config/helpers";

const CustomButton = ({ type, title, customStyles, handleClick, disabled }) => {
  const snap = useSnapshot(state);

  const generateStyle = (type) => {
    if (type === "filled") {
      return {
        backgroundColor: snap.color,
        color: getContrastingColor(snap.color),
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      };
    } else if (type === "outline") {
      return {
        borderWidth: "1px",
        borderColor: snap.color,
        color: snap.color,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      };
    }
  };

  return (
    <button
      className={`px-2 py-1.5 flex-1 rounded-xl ${customStyles}`}
      style={generateStyle(type)}
      onClick={disabled ? null : handleClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default CustomButton;
