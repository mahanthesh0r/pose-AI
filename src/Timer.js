import React from 'react'
import { useCountdownTimer } from 'use-countdown-timer';

export default function Timer() {
    const { countdown, start, reset, pause, isRunning } = useCountdownTimer({
        timer: 10000 * 5,
        autostart: true,
      });

    return (
        <div>
            {countdown}
        </div>
    )
}
