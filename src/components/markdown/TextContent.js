import React, { createContext, useState, useContext } from 'react';

const TextContext = createContext();

export const TextProvider = ({ children }) => {
  const [text, setText] = useState('');

  return (
    <TextContext.Provider value={{ text, setText }}>
      {children}
    </TextContext.Provider>
  );
};

export const useText = () => {
  return useContext(TextContext);
};