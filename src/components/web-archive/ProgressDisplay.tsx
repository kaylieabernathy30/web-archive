// @ts-nocheck 
"use client";

import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ProgressDisplayProps {
  isProcessing: boolean;
  statusMessage: string;
  processCompleted: boolean;
}

export function ProgressDisplay({ isProcessing, statusMessage, processCompleted }: ProgressDisplayProps) {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isProcessing) {
      setProgressValue(0); // Reset on new process start
      // Simulate progress for better UX as server action is one-shot
      let currentProgress = 0;
      interval = setInterval(() => {
        currentProgress += 5; // Increment progress
        if (currentProgress >= 95) { // Don't let client side reach 100%
          // Let final 100% be set by processCompleted
          clearInterval(interval);
        }
        setProgressValue(currentProgress);
      }, 200); 
    } else {
      setProgressValue(processCompleted ? 100 : 0); 
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing, processCompleted]);

  if (!isProcessing && !processCompleted) {
    return null; // Don't show if idle
  }

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-card shadow mt-6">
      <div className="flex items-center space-x-2">
        {isProcessing ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <CheckCircle2 className="h-5 w-5 text-accent" />
        )}
        <p className="text-sm font-medium text-foreground">{statusMessage}</p>
      </div>
      <Progress value={progressValue} className={isProcessing && progressValue < 95 ? "animate-progress-indeterminate" : ""} />
      {isProcessing && <p className="text-xs text-muted-foreground text-center">This might take a few moments...</p>}
    </div>
  );
}
