import { useEffect, useRef, useState } from "react";
import "./CustomCursor.css";

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const ringRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // Track mouse position natively
    const mousePos = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (typeof window === "undefined" || window.innerWidth <= 768) return;

        let animationFrameId;

        const onMouseMove = (e) => {
            mousePos.current.x = e.clientX;
            mousePos.current.y = e.clientY;

            // Make it visible immediately upon mouse move if it wasn't
            if (!isVisible) setIsVisible(true);

            // Update main dot immediately (no lag)
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
            }
        };

        const renderLoop = () => {
            // Smoothly interpolate the ring towards the mouse position
            ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
            ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

            if (ringRef.current) {
                // Adjust for center of the 32px ring (offset by half width/height depending on hover state in CSS, but CSS transform-origin doesn't strictly work smoothly with width mutations, so we center based on standard size.
                // If hover state expands width, CSS translate(-50%, -50%) handles the expanding center.
                ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
            }

            animationFrameId = requestAnimationFrame(renderLoop);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);
        const handleHoverStart = () => setIsHovering(true);
        const handleHoverEnd = () => setIsHovering(false);

        // Global events
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        document.body.addEventListener("mouseleave", handleMouseLeave);
        document.body.addEventListener("mouseenter", handleMouseEnter);

        // Hover events for interactive elements (using Event Delegation to catch dynamic elements)
        const handleMouseOverDelegated = (e) => {
            const target = e.target;
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.tagName === 'SELECT' ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('.cursor-pointer')
            ) {
                handleHoverStart();
            } else {
                handleHoverEnd();
            }
        };

        document.body.addEventListener("mouseover", handleMouseOverDelegated);

        // Start render loop
        renderLoop();

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
            document.body.removeEventListener("mouseenter", handleMouseEnter);
            document.body.removeEventListener("mouseover", handleMouseOverDelegated);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    if (typeof window === "undefined" || window.innerWidth <= 768) return null; // Hide on mobile

    return (
        <>
            <div
                ref={cursorRef}
                className={`custom-cursor ${isVisible ? "visible" : ""} ${isHovering ? "hover" : ""}`}
            />
            <div
                ref={ringRef}
                className={`cursor-ring ${isVisible ? "visible" : ""} ${isHovering ? "hover" : ""}`}
            />
        </>
    );
};

export default CustomCursor;
