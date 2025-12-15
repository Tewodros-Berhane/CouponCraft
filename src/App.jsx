import React from "react";
import Routes from "./Routes";
import { ToastProvider } from "./components/ui/ToastProvider";

function App() {
  return (
    <ToastProvider>
      <Routes />
    </ToastProvider>
  );
}

export default App;
