import React from "react";
import Header from "./components/Header";
import Homepage from "./pages/Homepage";
import Admin from "./pages/Admin";
import "./style/App.scss";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import Footer from "./components/Footer";
import { useThema } from "./hooks/useThema";
import NotFound from "./pages/NotFound";
function App() {
  const theme = useThema();
  const appClassName = `${theme === "dark" ? "dark-theme" : "light-theme"}`;
  return (
    <div className={appClassName}>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        ></Route>
        <Route path="/*" element={<NotFound />}></Route>
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
