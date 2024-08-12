import { useState } from "react";
import TestContext from "./TestContext";

const ContextWrapper = ({ children }) => {
  const [count, setCount] = useState(0);
  return <TestContext.Provider value={{ count, setCount }}>{children}</TestContext.Provider>;
};

export default ContextWrapper