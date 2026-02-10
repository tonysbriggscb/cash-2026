import { useState } from "react";
import Lottie from "lottie-react";
import splashAnimation from "./assets/splash-animation.json";

interface SplashScreenProps {
  onComplete: () => void;
}

/**
 * Splash screen with Lottie animation
 * Displays once when the app loads, then fades out to reveal the gray background
 */
export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleAnimationComplete = () => {
    setIsFadingOut(true);
    // Wait for fade out, then signal complete
    setTimeout(onComplete, 400);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#0A0B0D",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isFadingOut ? 0 : 1,
        transition: "opacity 0.4s ease-out",
        zIndex: 10000,
        pointerEvents: isFadingOut ? "none" : "auto",
      }}
    >
      <Lottie
        animationData={splashAnimation}
        loop={false}
        autoplay={true}
        onComplete={handleAnimationComplete}
        style={{
          width: 375,
          height: 375,
        }}
      />
    </div>
  );
};
