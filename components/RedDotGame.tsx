"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import { clsx } from "clsx";

dayjs.extend(duration);

type DifficultyKey = "easy" | "medium" | "hard";

const difficultyConfig: Record<DifficultyKey, {
  duration: number;
  label: string;
  description: string;
  moveInterval: number;
  decoys: number;
}> = {
  easy: {
    duration: 180,
    label: "Easy",
    description: "Hold the dot with your gaze and pointer for gentle focus priming.",
    moveInterval: 0,
    decoys: 0,
  },
  medium: {
    duration: 300,
    label: "Medium",
    description: "Dot glides to new coordinates, forcing micro-adjustments and resilience.",
    moveInterval: 2200,
    decoys: 1,
  },
  hard: {
    duration: 420,
    label: "Hard",
    description: "Chaotic field with moving decoys — stay with the target amidst distractions.",
    moveInterval: 1500,
    decoys: 3,
  },
};

function formatTime(seconds: number) {
  const durationValue = dayjs.duration(seconds, "seconds");
  const m = durationValue.minutes().toString().padStart(2, "0");
  const s = durationValue.seconds().toString().padStart(2, "0");
  return `${m}:${s}`;
}

const DECOY_COLORS = ["#61A5C2", "#FCA17D", "#C8553D", "#9A348E"];

export function RedDotGame() {
  const [difficulty, setDifficulty] = useState<DifficultyKey>("easy");
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(difficultyConfig.easy.duration);
  const [focusedSeconds, setFocusedSeconds] = useState(0);
  const [distractionEvents, setDistractionEvents] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 45, y: 45 });
  const [decoys, setDecoys] = useState<{ id: number; x: number; y: number }[]>([]);
  const fieldRef = useRef<HTMLDivElement | null>(null);

  const config = useMemo(() => difficultyConfig[difficulty], [difficulty]);

  useEffect(() => {
    setSecondsLeft(config.duration);
    setFocusedSeconds(0);
    setDistractionEvents(0);
    setTargetPosition({ x: 45, y: 45 });
  }, [config]);

  const generatePosition = useCallback(() => {
    return {
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
    };
  }, []);

  const spawnDecoys = useCallback(() => {
    setDecoys(
      Array.from({ length: config.decoys }).map((_, index) => ({
        id: index,
        ...generatePosition(),
      }))
    );
  }, [config.decoys, generatePosition]);

  useEffect(() => {
    spawnDecoys();
  }, [spawnDecoys]);

  useEffect(() => {
    if (!isRunning) return;

    const countdown = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(countdown);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(countdown);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    const focusTracker = window.setInterval(() => {
      setFocusedSeconds((prev) => (hovering ? prev + 1 : prev));
    }, 1000);

    return () => window.clearInterval(focusTracker);
  }, [isRunning, hovering]);

  useEffect(() => {
    if (!isRunning || config.moveInterval === 0) return;

    const mover = window.setInterval(() => {
      setTargetPosition(generatePosition());
      if (config.decoys > 0) {
        setDecoys((prev) =>
          prev.map((decoy) => ({
            ...decoy,
            ...generatePosition(),
          }))
        );
      }
    }, config.moveInterval);

    return () => window.clearInterval(mover);
  }, [isRunning, config.moveInterval, config.decoys, generatePosition]);

  useEffect(() => {
    if (!isRunning || config.decoys === 0) return;

    const decoyMover = window.setInterval(() => {
      setDecoys((prev) =>
        prev.map((decoy) => ({
          ...decoy,
          ...generatePosition(),
        }))
      );
    }, Math.max(900, config.moveInterval - 600));

    return () => window.clearInterval(decoyMover);
  }, [isRunning, config.decoys, config.moveInterval, generatePosition]);

  const performanceScore = useMemo(() => {
    if (!config.duration) return 0;
    const focusRatio = focusedSeconds / config.duration;
    const distractionPenalty = Math.max(0, 1 - distractionEvents * 0.07);
    return Math.round(focusRatio * distractionPenalty * 100);
  }, [config.duration, focusedSeconds, distractionEvents]);

  const handleStart = () => {
    setIsRunning(true);
    setSecondsLeft(config.duration);
    setFocusedSeconds(0);
    setDistractionEvents(0);
    setTargetPosition(generatePosition());
    spawnDecoys();
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <div className="card">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="badge bg-soft-rose/30 text-deep-blue">Red Dot Focus</span>
            <span className="text-xs uppercase tracking-[0.35em] text-night/45">Stability</span>
          </div>
          <p className="text-night/70 text-sm">
            Train deep visual lock-in. Stay with the target no matter how the
            field shifts.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          {(Object.keys(difficultyConfig) as DifficultyKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setDifficulty(key)}
              className={clsx(
                "rounded-full border px-4 py-2 transition-all",
                difficulty === key
                  ? "border-calm-teal bg-calm-teal text-white shadow"
                  : "border-transparent bg-white/60 text-night/70 hover:border-calm-teal/40"
              )}
              disabled={isRunning}
            >
              {difficultyConfig[key].label}
            </button>
          ))}
        </div>
        <p className="text-night/60 text-sm">{config.description}</p>
        <div
          ref={fieldRef}
          className="relative h-72 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-white/80 via-white/40 to-white/70 shadow-inner"
        >
          <div className="absolute left-6 top-6 rounded-full bg-white/80 px-3 py-1 text-xs text-night/60">
            Remaining {formatTime(secondsLeft)}
          </div>
          <motion.button
            type="button"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => {
              setHovering(false);
              if (isRunning) setDistractionEvents((prev) => prev + 1);
            }}
            className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-8 border-rose-200 bg-[#d11a2a] shadow-lg"
            style={{
              left: `${targetPosition.x}%`,
              top: `${targetPosition.y}%`,
              transition: config.moveInterval === 0 ? "" : "left 0.8s ease, top 0.8s ease",
              cursor: "default",
            }}
            aria-label="Focus target"
          />
          {decoys.map((decoy, index) => (
            <motion.span
              key={decoy.id}
              className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
              style={{
                left: `${decoy.x}%`,
                top: `${decoy.y}%`,
                backgroundColor: DECOY_COLORS[index % DECOY_COLORS.length],
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {!isRunning ? (
            <button onClick={handleStart} className="btn btn-primary">
              Start Focus Session
            </button>
          ) : (
            <button onClick={handleStop} className="btn btn-secondary">
              Conclude Session
            </button>
          )}
          <span className="text-xs text-night/50">
            Keep your pointer gently resting on the red target to accumulate
            focus seconds. Leaving the target triggers a distraction event.
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.3em] text-night/40">Focus time</p>
            <p className="mt-2 text-2xl font-semibold text-deep-blue">
              {formatTime(focusedSeconds)}
            </p>
            <p className="mt-2 text-sm text-night/60">
              Aim for 80%+ focused seconds to train unwavering attention.
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.3em] text-night/40">Distractions</p>
            <p className="mt-2 text-2xl font-semibold text-deep-blue">{distractionEvents}</p>
            <p className="mt-2 text-sm text-night/60">
              Each time you leave the target, notice the impulse, label it, and
              return without judgement.
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.3em] text-night/40">Performance</p>
            <p className="mt-2 text-2xl font-semibold text-deep-blue">{performanceScore}</p>
            <p className="mt-2 text-sm text-night/60">
              Score blends focus ratio and distraction resilience. Track growth
              week over week.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
