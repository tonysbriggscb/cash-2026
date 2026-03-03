import { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import splashAnimation from "./assets/splash-animation.json";

interface SplashScreenProps {
  onComplete: () => void;
}

// Maximum time (ms) to wait for the Lottie animation before force-completing.
const SPLASH_TIMEOUT_MS = 4000;

/**
 * Splash screen with Lottie animation
 * Displays once when the app loads, then fades out to reveal the gray background.
 * A safety timeout ensures the prototype is never permanently blocked if the
 * animation fails to fire onComplete (e.g. after a dev-server restart).
 */
export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const completedRef = useRef(false);

  const complete = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsFadingOut(true);
    setTimeout(onComplete, 400);
  };

  // Safety net: force-complete if animation never fires onComplete
  useEffect(() => {
    const id = setTimeout(complete, SPLASH_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, []);

  const handleAnimationComplete = () => complete();

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
