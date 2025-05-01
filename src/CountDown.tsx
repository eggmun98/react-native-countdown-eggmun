import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CountDownProps } from './types';

const DEFAULT_DIGIT_STYLE = { backgroundColor: '#00f7ff' };
const DEFAULT_DIGIT_TXT_STYLE = { color: '#000' };
const DEFAULT_TIME_LABEL_STYLE = { color: '#000' };
const DEFAULT_SEPARATOR_STYLE = { color: '#000' };
const DEFAULT_TIME_TO_SHOW = ['D', 'H', 'M', 'S'];
const DEFAULT_TIME_LABELS = {
  d: 'D',
  h: 'H',
  m: 'M',
  s: 'S',
};

const formatTime = (days: number, hours: number, minutes: number, seconds: number): string => {
  return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const CountDown: React.FC<CountDownProps> = ({
  digitStyle = DEFAULT_DIGIT_STYLE,
  digitTxtStyle = DEFAULT_DIGIT_TXT_STYLE,
  timeLabelStyle = DEFAULT_TIME_LABEL_STYLE,
  separatorStyle = DEFAULT_SEPARATOR_STYLE,
  timeToShow = DEFAULT_TIME_TO_SHOW,
  showSeparator = false,
  showLabels = false,
  size = 15,
  until,
  onChange,
  onPress,
  onFinish,
  running = true,
  autoRestart = false,
  style,
  timeLabels = DEFAULT_TIME_LABELS,
}) => {
  const [remainingTime, setRemainingTime] = useState(Math.max(until, 0));
  const [wentBackgroundAt, setWentBackgroundAt] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const lastUpdateTimeRef = useRef(Date.now());

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMountedRef.current) {
      setRemainingTime(Math.max(until, 0));
    }
  }, [until]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (!isMountedRef.current) return;

      if (nextAppState === 'active' && wentBackgroundAt && running) {
        const diff = Math.floor((Date.now() - wentBackgroundAt) / 1000.0);
        const newTime = Math.max(0, remainingTime - diff);

        // 시, 분, 초 계산
        const hours = Math.floor(newTime / 3600);
        const minutes = Math.floor((newTime % 3600) / 60);
        const seconds = newTime % 60;

        // 올바른 형식으로 시간 설정
        setRemainingTime(hours * 3600 + minutes * 60 + seconds);
      }
      if (nextAppState === 'background') {
        setWentBackgroundAt(Date.now());
      }
    },
    [remainingTime, running, wentBackgroundAt],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);

  useEffect(() => {
    if (remainingTime === 0 && running) {
      onFinish?.();
    }
  }, [remainingTime, running]);

  const handleTimerTick = useCallback(() => {
    if (!isMountedRef.current) return;

    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current;

    if (timeSinceLastUpdate >= 1000) {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          if (autoRestart) {
            return until;
          }
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        const newTime = prevTime - 1;
        onChange?.(newTime);
        lastUpdateTimeRef.current = now;
        return newTime;
      });
    }
  }, [autoRestart, until]);

  useEffect(() => {
    if (!running) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(handleTimerTick, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [running, handleTimerTick]);

  const getTimeLeft = useCallback(() => {
    return {
      seconds: remainingTime % 60,
      minutes: Math.floor(remainingTime / 60) % 60,
      hours: Math.floor(remainingTime / (60 * 60)) % 24,
      days: Math.floor(remainingTime / (60 * 60 * 24)),
    };
  }, [remainingTime]);

  const renderDigit = (digit: string) => (
    <View style={[styles.digitCont, { width: size * 2.3, height: size * 2.6 }, digitStyle]}>
      <Text style={[styles.digitTxt, { fontSize: size }, digitTxtStyle]}>{digit}</Text>
    </View>
  );

  const renderLabel = (label: string) => {
    if (!label || !showLabels) return null;
    return <Text style={[styles.timeTxt, { fontSize: size / 1.8 }, timeLabelStyle]}>{label}</Text>;
  };

  const renderDoubleDigits = (label: string, digits: string) => (
    <View style={styles.doubleDigitCont}>
      <View style={styles.timeInnerCont}>{renderDigit(digits)}</View>
      {renderLabel(label)}
    </View>
  );

  const renderSeparator = () => (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Text style={[styles.separatorTxt, { fontSize: size * 1.2 }, separatorStyle]}>:</Text>
    </View>
  );

  const renderCountDown = () => {
    const { days, hours, minutes, seconds } = getTimeLeft();
    const newTime = formatTime(days, hours, minutes, seconds).split(':');
    const Component = onPress ? TouchableOpacity : View;

    return (
      <Component style={styles.timeCont} onPress={onPress}>
        {timeToShow.includes('D') && renderDoubleDigits(timeLabels.d, newTime[0])}
        {showSeparator && timeToShow.includes('D') && timeToShow.includes('H') && renderSeparator()}
        {timeToShow.includes('H') && renderDoubleDigits(timeLabels.h, newTime[1])}
        {showSeparator && timeToShow.includes('H') && timeToShow.includes('M') && renderSeparator()}
        {timeToShow.includes('M') && renderDoubleDigits(timeLabels.m, newTime[2])}
        {showSeparator && timeToShow.includes('M') && timeToShow.includes('S') && renderSeparator()}
        {timeToShow.includes('S') && renderDoubleDigits(timeLabels.s, newTime[3])}
      </Component>
    );
  };

  return <View style={style}>{renderCountDown()}</View>;
};

const styles = StyleSheet.create({
  timeCont: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timeTxt: {
    color: 'white',
    marginVertical: 2,
    backgroundColor: 'transparent',
  },
  timeInnerCont: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitCont: {
    borderRadius: 10,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doubleDigitCont: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitTxt: {
    color: 'white',
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  separatorTxt: {
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
});

export default CountDown;
