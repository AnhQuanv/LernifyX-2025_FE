"use client";
import { useState, useEffect } from "react";

interface CountdownTimerProps {
  expiresAt: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(expiresAt).getTime();
      const difference = expiryTime - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const formatNumber = (num: number) => (num < 10 ? `0${num}` : num);

      setTimeLeft(
        `${formatNumber(days)}d : ${formatNumber(hours)}h : ${formatNumber(
          minutes
        )}m : ${formatNumber(seconds)}s`
      );
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return <span className="text-xs font-semibold text-white">{timeLeft}</span>;
};

export default CountdownTimer;
