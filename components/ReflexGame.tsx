"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

const difficultyMap = {
  easy: {
    label: "Easy",
    spawnInterval: [1600, 2200],
    targetChance: 0.35,
    reward: 12,
    penalty: 6,
    missPenalty: 4,
  },
  medium: {
    label: "Medium",
    spawnInterval: [1100, 1800],
    targetChance: 0.4,
    reward: 14,
    penalty: 8,
    missPenalty: 6,
  },
  hard: {
    label: "Hard",
    spawnInterval: [800, 1500],
    targetChance: 0.45,
    reward: 18,
    penalty: 10,
    missPenalty: 12,
  },
} as const;

type DifficultyKey = keyof typeof difficultyMap;

type Stimulus = {
  id: number;
  color: string;
  isTarget: boolean;
};

const colors = ["#3D5A80", "#98C1D9", "#EE6C4D", "#F4F1DE", "#2A9D8F"];

function randomBetween([min, max]: readonly [number, number]) {
  return Math.floor(Math.random() * (max - min)) + min;
}

let stimulusId = 0;

export function ReflexGame() {
  const [difficulty, setDifficulty] = useState<DifficultyKey>("easy");
  const [stimulus, setStimulus] = useState<Stimulus | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const targetAppearedAt = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const handledStimulusRef = useRef(false);

  const config = useMemo(() => difficultyMap[difficulty], [difficulty]);

  const scheduleStimulus = useCallback(() => {
    if (!isRunning) return;
    const delay = randomBetween(config.spawnInterval);
    timerRef.current = window.setTimeout(() => {
      const isTarget = Math.random() < config.targetChance;
      const newStimulus: Stimulus = {
        id: ++stimulusId,
        color: isTarget ? "#D90429" : colors[Math.floor(Math.random() * colors.length)],
        isTarget,
      };
      handledStimulusRef.current = false;
      setStimulus(newStimulus);
      targetAppearedAt.current = isTarget ? performance.now() : null;
      scheduleStimulus();
      const lifeSpan = Math.max(450, Math.min(isTarget ? 1100 : 800, delay - 120));
      window.setTimeout(() => {
        if (!handledStimulusRef.current && newStimulus.isTarget) {
          setMisses((prev) => prev + 1);
          setScore((prev) => prev - config.missPenalty);
        }
        setStimulus((current) => (current?.id === newStimulus.id ? null : current));
      }, lifeSpan);
    }, delay) as unknown as number;
  }, [config, isRunning]);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      return;
    }
    scheduleStimulus();

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [isRunning, scheduleStimulus]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      event.preventDefault();
      if (!stimulus || handledStimulusRef.current) {
        setFalseAlarms((prev) => prev + 1);
        setScore((prev) => prev - Math.ceil(config.penalty / 2));
        return;
      }

      handledStimulusRef.current = true;

      if (stimulus.isTarget) {
        setHits((prev) => prev + 1);
        setScore((prev) => prev + config.reward);
        const appearedAt = targetAppearedAt.current;
        if (typeof appearedAt === "number") {
          setReactionTimes((prev) => [
            ...prev.slice(-9),
            performance.now() - appearedAt,
          ]);
        }
      } else {
        setFalseAlarms((prev) => prev + 1);
        setScore((prev) => prev - config.penalty);
      }
      setStimulus(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stimulus, config]);

  const handleStart = () => {
    setIsRunning(true);
    setScore(0);
    setHits(0);
    setMisses(0);
    setFalseAlarms(0);
    setReactionTimes([]);
    setStimulus(null);
  };

  const handleStop = () => {
    setIsRunning(false);
    setStimulus(null);
  };

  const averageReaction = useMemo(() => {
    if (!reactionTimes.length) return 0;
    return Math.round(reactionTimes.reduce((acc, value) => acc + value, 0) / reactionTimes.length);
  }, [reactionTimes]);

  return (
    <div className="card">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="badge bg-calm-teal/25 text-deep-blue">Reflex Forge</span>
          <span className="text-xs uppercase tracking-[0.3em] text-night/45">Reaction</span>
        </div>
        <p className="text-sm text-night/60">
          Ready your nervous system. Tap the spacebar the moment the scarlet
          sphere appears. Precision matters more than speed.
        </p>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(difficultyMap) as DifficultyKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setDifficulty(key)}
              disabled={isRunning}
              className={clsx(
                "rounded-full border px-4 py-2 transition-all",
                difficulty === key
                  ? "border-calm-teal bg-calm-teal text-white shadow"
                  : "border-transparent bg-white/70 text-night/70 hover:border-calm-teal/40"
              )}
            >
              {difficultyMap[key].label}
            </button>
          ))}
        </div>
        <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-white/80 via-white/30 to-white/70 shadow-inner">
          <span className="absolute top-4 left-4 rounded-full bg-white/80 px-3 py-1 text-xs text-night/60">
            Score {score}
          </span>
          <AnimatePresence>
            {stimulus && (
              <motion.div
                key={stimulus.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.95 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: stimulus.color }}
              />
            )}
          </AnimatePresence>
          {!stimulus && !isRunning && (
            <div className="text-center text-sm text-night/50">
              Press start and stay poised. The red sphere will appear without
              warning.
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {!isRunning ? (
            <button onClick={handleStart} className="btn btn-primary">
              Begin Reflex Drill
            </button>
          ) : (
            <button onClick={handleStop} className="btn btn-secondary">
              Pause Drill
            </button>
          )}
          <span className="text-xs text-night/50">
            Red sphere = press space. Anything else = stay still to avoid
            penalties.
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.25em] text-night/45">Hits</p>
            <p className="mt-2 text-2xl font-semibold text-deep-blue">{hits}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.25em] text-night/45">Misses</p>
            <p className="mt-2 text-2xl font-semibold text-deep-blue">{misses}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.25em] text-night/45">False alarms</p>
            <p className="mt-2 text-2xl font-semibold text-deep-blue">{falseAlarms}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.25em] text-night/45">Avg reaction</p>
            <p className="mt-2 text-2xl font-semibold text-deep-blue">
              {averageReaction ? `${averageReaction} ms` : "--"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
