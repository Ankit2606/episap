import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./Header.jsx";
import Home from "../pages/Home.jsx";
import LeafNFT from "../pages/LeafNFT.jsx";
import MyCreatedLeaf from "../pages/MyCretedLeaf.jsx";
import MarketPlace from "../pages/MarketPlace.jsx";
import MYNFT from "../pages/MYNFT.jsx";
import CreateIdea from "../pages/CreateIdea.jsx";

const Router = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leafnft" element={<LeafNFT />} />
        <Route path="/createleaf" element={<MyCreatedLeaf />} />
        <Route path="/marketplace" element={<MarketPlace />} />
        <Route path="/mynft" element={<MYNFT />} />
        <Route path="/createidea" element={<CreateIdea />} />
      </Routes>
    </>
  );
};

export default Router;
