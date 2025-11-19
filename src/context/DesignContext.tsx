import { createContext, useContext, useState } from "react";

export type DesignLib = "tailwind" | "bootstrap";

interface DesignContextType {
  design: DesignLib;
  setDesign: (d: DesignLib) => void;
}

const DesignContext = createContext<DesignContextType>({
  design: "tailwind",
  setDesign: () => {},
});

export const DesignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [design, setDesign] = useState<DesignLib>("tailwind");

  return (
    <DesignContext.Provider value={{ design, setDesign }}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => useContext(DesignContext);
