"use client";
import React, { useState } from "react";
import { ImageOff } from "lucide-react";
import clsx from "clsx";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    fallbackCategory?: "stadium" | "player" | "trophy" | "fans";
}

const STOCK_IMAGES = {
    stadium: "https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=1000",
    player: "https://images.unsplash.com/photo-1579952363873-27f3bde9be2b?q=80&w=1000",
    trophy: "https://images.unsplash.com/photo-1561069934-ee2258988530?q=80&w=1000",
    fans: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000",
    generic: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1000"
};

const getRelevantStockImage = (text: string = ""): string => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes("stadium") || lowerText.includes("arena") || lowerText.includes("host") || lowerText.includes("city")) {
        return STOCK_IMAGES.stadium;
    }
    if (lowerText.includes("qualifier") || lowerText.includes("player")) {
        return STOCK_IMAGES.player;
    }
    if (lowerText.includes("schedule") || lowerText.includes("cup") || lowerText.includes("trophy") || lowerText.includes("win")) {
        return STOCK_IMAGES.trophy;
    }
    if (lowerText.includes("fan") || lowerText.includes("crowd")) {
        return STOCK_IMAGES.fans;
    }

    return STOCK_IMAGES.generic;
};

export default function ImageWithFallback({ src, alt, className, fallbackSrc, ...props }: ImageWithFallbackProps) {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasFailed, setHasFailed] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const handleError = () => {
        if (!hasFailed) {
            // First try: load the relevant stock image based on alt text
            const relevantFallback = getRelevantStockImage(alt);

            // If the broken link WAS the relevant fallback (avoid loop), show error
            if (imgSrc === relevantFallback) {
                setHasFailed(true); // Stop trying
            } else {
                setImgSrc(relevantFallback);
                setHasFailed(true); // Mark as failed so we don't loop if fallback fails too
            }
        }
    };

    return (
        <div className={clsx("relative overflow-hidden", className)}>
            {!loaded && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse z-10" />
            )}
            <img
                src={imgSrc || getRelevantStockImage(alt)}
                alt={alt}
                className={clsx("w-full h-full object-cover transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
                onLoad={() => setLoaded(true)}
                onError={handleError}
                {...props}
            />

            {/* If even fallback failed completely (rare), overlay error icon */}
            {hasFailed && !loaded && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center flex-col gap-2 text-gray-500 z-20">
                    <ImageOff size={32} />
                </div>
            )}
        </div>
    );
}
