'use client';

import { useEffect, useState } from 'react';
import { weddingDateTimeToEpoch } from '@/lib/utils';

export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

const ZERO: CountdownValue = { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: false };

export function useCountdown(
  date: string | null,
  time: string | null,
  timezone: string
): CountdownValue {
  const [value, setValue] = useState<CountdownValue>(ZERO);

  useEffect(() => {
    const targetEpoch = weddingDateTimeToEpoch(date, time, timezone);
    if (targetEpoch === null) {
      setValue(ZERO);
      return;
    }

    const tick = () => {
      const diff = targetEpoch - Date.now();
      if (diff <= 0) {
        setValue({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true });
        return;
      }
      const days = Math.floor(diff / 86_400_000);
      const hours = Math.floor((diff % 86_400_000) / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);
      const seconds = Math.floor((diff % 60_000) / 1000);
      setValue({ days, hours, minutes, seconds, isComplete: false });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [date, time, timezone]);

  return value;
}
