//@ts-nocheck

import React, { createContext, useContext, useState } from 'react';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';

// Создаем контекст для инструментов
const ToolbarContext = createContext();

// Компонент-провайдер для инструментов
export const ToolbarProvider = ({ children }) => {
  const [toolbarPlugin, setToolbarPlugin] = useState(createToolbarPlugin());

  return (
    <ToolbarContext.Provider value={{ toolbarPlugin, setToolbarPlugin }}>
      {children}
    </ToolbarContext.Provider>
  );
};

// Хук для использования контекста инструментов
export const useToolbar = () => useContext(ToolbarContext);
