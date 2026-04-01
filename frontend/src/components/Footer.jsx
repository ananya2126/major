import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-20 py-6 text-center text-sm text-slate-500">
      © {new Date().getFullYear()} EduPortal. All rights reserved.
    </footer>
  );
};

export default Footer;
