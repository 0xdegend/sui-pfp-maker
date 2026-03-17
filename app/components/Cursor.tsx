"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX - 5,
        y: e.clientY - 5,
        duration: 0.1,
        ease: "power2.out",
      });
      gsap.to(follower, {
        x: e.clientX - 16,
        y: e.clientY - 16,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    const onEnterLink = () => {
      gsap.to(follower, {
        scale: 2,
        borderColor: "rgba(77,162,255,0.7)",
        duration: 0.2,
      });
    };
    const onLeaveLink = () => {
      gsap.to(follower, {
        scale: 1,
        borderColor: "rgba(77,162,255,0.45)",
        duration: 0.2,
      });
    };

    document.addEventListener("mousemove", moveCursor);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}
