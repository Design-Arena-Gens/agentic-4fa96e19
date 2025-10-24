"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { motion } from "framer-motion";

dayjs.extend(duration);

const STORAGE_KEY = "focus-haven-cycles";

type Phase = "focus" | "break";

type CycleLog = {
  date: string;
  cycles: number;
};

function getTodayKey() {
  return dayjs().format("YYYY-MM-DD");
}

function formatMinutes(mins: number) {
  return `${mins.toString().padStart(2, "0")}:00`;
}

function formatSeconds(seconds: number) {
  const durationValue = dayjs.duration(seconds, "seconds");
  const m = durationValue.minutes().toString().padStart(2, "0");
  const s = durationValue.seconds().toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function PomodoroTimer() {
  const [focusLength, setFocusLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [phase, setPhase] = useState<Phase>("focus");
  const [secondsLeft, setSecondsLeft] = useState(focusLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  const syncWithServer = useCallback(async (cycles: number) => {
    try {
      await fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cycles, date: getTodayKey() }),
      });
    } catch (error) {
      console.error("Unable to sync cycles", error);
    }
  }, []);

  useEffect(() => {
    if (phase === "focus") {
      setSecondsLeft(focusLength * 60);
    } else {
      setSecondsLeft(breakLength * 60);
    }
  }, [focusLength, breakLength, phase]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!stored) return;
    try {
      const parsed: CycleLog[] = JSON.parse(stored);
      const today = parsed.find((entry) => entry.date === getTodayKey());
      if (today) {
        setCycleCount(today.cycles);
      }
    } catch (error) {
      console.error("Unable to parse stored cycle data", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const response = await fetch("/api/metrics");
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted && typeof data.cycles === "number") {
          setCycleCount((prev) => Math.max(prev, data.cycles));
        }
      } catch (error) {
        console.error("Unable to fetch cycles", error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const recordCycle = useCallback(() => {
    const today = getTodayKey();
    setCycleCount((prev) => {
      const updated = prev + 1;
      if (typeof window !== "undefined") {
        try {
          const existing = localStorage.getItem(STORAGE_KEY);
          let logs: CycleLog[] = existing ? JSON.parse(existing) : [];
          const todayLog = logs.find((entry) => entry.date === today);
          if (todayLog) {
            todayLog.cycles = updated;
          } else {
            logs.push({ date: today, cycles: updated });
          }
          logs = logs.filter((entry) => dayjs().diff(entry.date, "day") <= 6);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
        } catch (error) {
          console.error("Failed to persist cycle count", error);
        }
      }
      syncWithServer(updated);
      return updated;
    });
  }, [syncWithServer]);

  const handlePhaseComplete = useCallback(() => {
    if (phase === "focus") {
      setPhase("break");
      setSecondsLeft(breakLength * 60);
      recordCycle();
    } else {
      setPhase("focus");
      setSecondsLeft(focusLength * 60);
    }
  }, [phase, breakLength, focusLength, recordCycle]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handlePhaseComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, handlePhaseComplete]);

  const progressPercent = useMemo(() => {
    const totalSeconds = (phase === "focus" ? focusLength : breakLength) * 60;
    if (totalSeconds === 0) return 0;
    return Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);
  }, [phase, focusLength, breakLength, secondsLeft]);

  const handleToggle = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase("focus");
    setSecondsLeft(focusLength * 60);
  };

  return (
    <div className="card">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <span className="badge bg-calm-teal/20 text-calm-teal">Rhythm Pomodoro</span>
          <span className="text-xs uppercase tracking-[0.3em] text-night/50">Build Consistency</span>
        </div>
        <div className="rounded-3xl bg-white/70 p-6 shadow-inner">
          <div className="flex flex-col items-center gap-6">
            <motion.div
              key={`${phase}-${secondsLeft}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-5xl font-light text-deep-blue"
            >
              {formatSeconds(secondsLeft)}
            </motion.div>
            <div className="flex gap-4 text-sm uppercase tracking-[0.2em] text-night/60">
              <span className={phase === "focus" ? "text-calm-teal" : ""}>Focus</span>
              <span>•</span>
              <span className={phase === "break" ? "text-calm-teal" : ""}>Break</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-night/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-calm-teal to-sunrise transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex w-full flex-col gap-4 md:flex-row">
              <div className="flex flex-1 flex-col rounded-2xl bg-white/90 p-4">
                <label className="text-xs font-semibold uppercase tracking-widest text-night/50">
                  Focus length
                </label>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-2xl text-deep-blue">{formatMinutes(focusLength)}</span>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={focusLength}
                    onChange={(event) => setFocusLength(Number(event.target.value))}
                    className="h-2 w-40 cursor-pointer rounded-lg bg-night/10"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col rounded-2xl bg-white/90 p-4">
                <label className="text-xs font-semibold uppercase tracking-widest text-night/50">
                  Restore break
                </label>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-2xl text-deep-blue">{formatMinutes(breakLength)}</span>
                  <input
                    type="range"
                    min={3}
                    max={20}
                    step={1}
                    value={breakLength}
                    onChange={(event) => setBreakLength(Number(event.target.value))}
                    className="h-2 w-40 cursor-pointer rounded-lg bg-night/10"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleToggle} className="btn btn-primary">
                {isRunning ? "Pause" : "Start Cycle"}
              </button>
              <button onClick={handleReset} className="btn btn-secondary">
                Reset
              </button>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.2em] text-night/50">Cycles today</p>
            <p className="mt-2 text-3xl font-semibold text-deep-blue">{cycleCount}</p>
            <p className="mt-2 text-sm text-night/60">
              Each focus + break loop is counted. Aim for 4+ complete cycles to
              unlock deep work momentum.
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.2em] text-night/50">Recommended</p>
            <p className="mt-2 text-sm text-night/60">
              Research suggests alternating 25 minute focus bursts with 5 minute
              breaks can improve recall by 16%.
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.2em] text-night/50">Pro tip</p>
            <p className="mt-2 text-sm text-night/60">
              Stack your meditation cool-down after two cycles to anchor the
              learning neural pathways.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
