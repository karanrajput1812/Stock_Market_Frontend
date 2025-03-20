import React from "react";
import './components.css'
import AnimatedTitle from "./AnimatedTitle";

function Header() {
  return (
    <header>
      <AnimatedTitle
            title="<b>H</b>erodha"
            className="special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
          /> 
      <h3>Invest in everything</h3>
    </header>
  );
}

export default Header;