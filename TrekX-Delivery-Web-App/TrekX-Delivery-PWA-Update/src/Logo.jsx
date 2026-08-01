import React from "react";
import logoImage from "./logo.png";

export default function Logo({ size = 40 }) {
  return (
    <img
      src={logoImage}
      alt="TrekX Delivery Logo"
      width={size}
      height={size}
      style={{ objectFit: "contain", display: "block" }}
    />
  );
}
