import React, { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};

export const PopupProvider = ({ children }) => {
  const [popupState, setPopupState] = useState({
    isOpen: false,
    message: "",
  });

  const showPopup = (message) => {
    setPopupState({ isOpen: true, message });
  };

  const hidePopup = () => {
    setPopupState({ isOpen: false, message: "" });
  };

  return (
    <PopupContext.Provider value={{ ...popupState, showPopup, hidePopup }}>
      {children}
    </PopupContext.Provider>
  );
};
