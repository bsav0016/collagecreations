import { useState } from "react";
import { IS_DESKTOP } from "../../utils/constants/constants";
import { cn } from "../../lib/utils";

interface ZoomableImageProps {
    src: string;
    alt: string;
    zoomScale?: number;
    className?: string;
}

// Same cursor-follow zoom used on the collage preview page (see preview.tsx), pulled out
// as its own component so the homepage hero can reuse it. Zoom is desktop-only, matching
// the preview page's IS_DESKTOP gate -- on touch devices "hover" is ambiguous (a tap fires
// both hover and click), so mobile just shows the image at rest instead.
export function ZoomableImage({ src, alt, zoomScale = 2.2, className }: ZoomableImageProps) {
    const [zoomed, setZoomed] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
        const image = e.currentTarget;
        const rect = image.getBoundingClientRect();
        const offsetX = ((e.clientX - rect.left) / rect.width) * 100;
        const offsetY = ((e.clientY - rect.top) / rect.height) * 100;
        image.style.transformOrigin = `${offsetX}% ${offsetY}%`;
        setZoomed(true);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLImageElement>) => {
        e.currentTarget.style.transformOrigin = "50% 50%";
        setZoomed(false);
    };

    return (
        // These mosaic example PNGs have real alpha transparency around the callout-photo
        // corner, not a baked-in fill color -- it's meant to show whatever sits behind it,
        // same as the small type-picker cards already do correctly (CollageTypeCard's
        // <img> has no background of its own, letting the card's bg-card show through).
        // This used to force a hardcoded white/slate backing here regardless of theme or
        // the actual section background, which looked like a mismatched box sitting on
        // top of the page instead of blending into it.
        <div className={cn("relative overflow-hidden rounded-xl border border-border shadow-lg", className)}>
            <img
                src={src}
                alt={alt}
                className="w-full h-auto transition-transform duration-200 ease-out"
                style={{ transform: `scale(${zoomed ? zoomScale : 1})` }}
                onMouseMove={IS_DESKTOP ? handleMouseMove : undefined}
                onMouseLeave={IS_DESKTOP ? handleMouseLeave : undefined}
            />
        </div>
    );
}
