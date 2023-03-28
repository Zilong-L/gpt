// Hamburger.tsx
import React from "react";

interface HamburgerProps {
    isOpen: boolean;
    toggle: () => void;
}

const Hamburger: React.FC<HamburgerProps> = ({ isOpen, toggle }) => {
    const commonClasses = "w-6 h-1 bg-black my-1 transition-all duration-300";

    return (
        <button
            onClick={toggle}
            className="flex h-10 w-10 flex-col items-center justify-center rounded-md  p-1 focus:outline-none"
        >
            <span
                className={`${commonClasses} ${
                    isOpen ? "rotate-45 transform" : ""
                }`}
            />
            <span className={`${commonClasses} ${isOpen ? "opacity-0" : ""}`} />
            <span
                className={`${commonClasses} ${
                    isOpen ? "-rotate-45 transform" : ""
                }`}
            />
        </button>
    );
};

export default Hamburger;
