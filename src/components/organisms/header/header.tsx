"use client";

import React, { useEffect, useState } from "react";
import Logo from "../../molecules/logo/logo";

export default function Header() {
    const [scrollProgress, setScrollProgress] = useState<number>(0);

    const handleScroll = () => {
        const scrollTop: number = window.scrollY;
        const scrollHeight: number = document.documentElement.scrollHeight;
        const clientHeight: number = document.documentElement.clientHeight;
    
        const totalScrollableHeight: number = scrollHeight - clientHeight;

        if(totalScrollableHeight > 0){
            setScrollProgress((scrollTop / totalScrollableHeight) * 100);
        } else {
            setScrollProgress(100);
        }
    };
    
    useEffect(() => {

        const frameId: number = window.requestAnimationFrame(handleScroll);
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

  return (
    <header className="flex w-full flex-col items-center justify-center gap-6 fixed">
        <div className="w-full h-2 bg-[#B2B2B2]">
            <div
                className="h-2 bg-linear-to-r from-seti-purple-80 to-white transition-[width]"
                style={{ width: `${scrollProgress}%` }}
            />
        </div>
        <div className="flex w-[90vw] items-start justify-between">
            <Logo/>
        </div>
    </header>
  );
}