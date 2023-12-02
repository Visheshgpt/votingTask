import React from "react";
import ConnectWallet from "../ConnectWallet";

const Navbar = () => {
  return (
    <div className="nav">
      <div className="logo-container">
        <div className="logo">Voting</div>
      </div>
      <div className="network-container"> 
        <div className="network">BSCT</div>
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Navbar;
