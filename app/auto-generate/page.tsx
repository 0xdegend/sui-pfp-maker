"use client";
import AutoGenPage from "../studio/components/AutoGenPage";
export default function Page() {
  return (
    <AutoGenPage
      onOpenManualEditor={(dataUrl) => {
        // navigate to /studio with the generated image
        // store in sessionStorage or Zustand, pick up in StudioPage
        sessionStorage.setItem("seedImage", dataUrl);
        window.location.href = "/studio";
      }}
    />
  );
}
