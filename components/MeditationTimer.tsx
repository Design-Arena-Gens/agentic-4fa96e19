"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const suggestions = [
  "Find a position where your spine feels light and long.",
  "Allow your shoulders to soften; relax your jaw.",
  "Gently close your eyes or lower your gaze.",
  "Notice the breath traveling in and out without controlling it.",
  "When a thought arrives, label it kindly and let it pass.",
  "Feel the air on your skin and the weight of your body.",
  "Set a gentle intention: 'I'm here for myself.'",
];

const presetOptions = [5, 10, 15, 20];

function formatTime(seconds: number) {
  const duration = dayjs.duration(seconds, "seconds");
  const m = duration.minutes().toString().padStart(2, "0");
  const s = duration.seconds().toString().padStart(2, "0");
  return `${m}:${s}`;
}

async function playChime() {
  try {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(528, context.currentTime);
    gainNode.gain.setValueAtTime(0.0001, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.3, context.currentTime + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 3);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 3.5);
  } catch (err) {
    console.error("Unable to play chime", err);
  }
}

export function MeditationTimer() {
  const [minutes, setMinutes] = useState(10);
  const [secondsRemaining, setSecondsRemaining] = useState(minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const currentMessage = useMemo(() => suggestions[messageIndex % suggestions.length], [messageIndex]);

  useEffect(() => {
    setSecondsRemaining(minutes * 60);
  }, [minutes]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setIsRunning(false);
          setTimeout(() => setSessionStarted(false), 2200);
          playChime();
          return 0;
        }
        return prev - 1;
      });
      setMessageIndex((idx) => idx + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setSessionStarted(true);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSessionStarted(false);
    setSecondsRemaining(minutes * 60);
    setMessageIndex(0);
  };

  return (
    <div className="card relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-calm-teal/30 via-soft-rose/40 to-transparent" />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="badge">Meditation Studio</span>
          <div className="text-sm text-night/60">Designed for calm clarity</div>
        </div>
        <div className="relative flex flex-col items-center gap-6 rounded-3xl bg-white/70 p-8 shadow-inner">
          <AnimatePresence mode="wait">
            <motion.div
              key={secondsRemaining}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="text-6xl font-light tracking-wide text-deep-blue"
            >
              {formatTime(secondsRemaining)}
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {sessionStarted ? (
              <motion.p
                key="affirmations"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
                className="max-w-md text-center text-night/70 relaxed-text"
              >
                {currentMessage}
              </motion.p>
            ) : (
              <motion.div
                key="selector"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <label className="text-night/60">Choose your journey</label>
                <div className="mt-4 flex flex-wrap gap-3">
                  {presetOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setMinutes(option)}
                      className={`rounded-full px-4 py-2 text-sm transition-all ${
                        option === minutes
                          ? "bg-calm-teal text-white shadow"
                          : "bg-white/70 text-night/70 hover:bg-calm-teal/10"
                      }`}
                    >
                      {option} min
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min={3}
                  max={30}
                  value={minutes}
                  onChange={(event) => setMinutes(Number(event.target.value))}
                  className="mt-6 h-2 w-full cursor-pointer appearance-none rounded-lg bg-night/10"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-3">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="btn btn-primary"
              >
                Begin Session
              </button>
            ) : (
              <button onClick={handleReset} className="btn btn-secondary">
                Reset
              </button>
            )}
            {!sessionStarted && (
              <div className="rounded-full bg-white/80 px-4 py-2 text-xs text-night/60">
                Gentle reminder: Press begin and breathe with the rhythm.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
