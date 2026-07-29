"use client";

import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { IParticlesProps } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

interface StarsBackgroundProps {
    className?: string;
}

const StarsBackground = ({ className = "absolute inset-0 -z-1" }: StarsBackgroundProps) => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        let mounted = true;
        
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            if (mounted) {
                setInit(true);
            }
        })

        return () => {
            mounted = false;
        };
    }, []);

    const options: NonNullable<IParticlesProps["options"]> = useMemo(() => ({
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
            },
            modes: {
                repulse: {
                    distance: 160,
                    duration: 4,
                    speed: 0.1,
                    easing: "ease-out-quad",
                },
            },
        },
        particles: {
            color: { value: ["#ffffff", "#f4efff", "#d9c8ff"] },
            move: {
                enable: true,
                speed: 0.5,
                direction: "none",
                outModes: {
                    default: "out"
                }
            },
            number: {
                value: 250,
                density: {
                    enable: true,
                },
            },
            size: {
                value: { min: 0.35, max: 1.35 },
                animation: {
                    enable: true,
                    speed: 0.9,
                    sync: false
                }
            },
            opacity: {
                value: { min: 0.24, max: 0.88 },
                animation: {
                    enable: true,
                    speed: 1.1,
                    sync: false,
                },
            },
            shadow: {
                enable: true,
                color: "#ffffff",
                blur: 3,
                offset: {
                    x: 0,
                    y: 0,
                },
            },
        },
    }), []);

    if (!init) {
        return null;
    }

    return (
        <Particles
            id="tsparticles"
            options={options}
            className={className}
        />
    )
};

export default StarsBackground;
