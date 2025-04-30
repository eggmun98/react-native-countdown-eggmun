import React, { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CountDownProps } from './types';



const DEFAULT_DIGIT_STYLE = { backgroundColor: '#FAB913' };
const DEFAULT_DIGIT_TXT_STYLE = { color: '#000' };
const DEFAULT_TIME_LABEL_STYLE = { color: '#000' };
const DEFAULT_SEPARATOR_STYLE = { color: '#000' };
const DEFAULT_TIME_TO_SHOW = ['D', 'H', 'M', 'S'];
const DEFAULT_TIME_LABELS = {
  d: 'Days',
  h: 'Hours',
  m: 'Minutes',
  s: 'Seconds',
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
  size = 15,
  until,
  onChange,
  onPress,
  onFinish,
  running = true,
  style,
  timeLabels = DEFAULT_TIME_LABELS,
}) => {
  const [remainingTime, setRemainingTime] = useState(Math.max(until, 0));
  const [wentBackgroundAt, setWentBackgroundAt] = useState<number | null>(null);

  const getTimeLeft = useCallback(() => {
    return {
      seconds: remainingTime % 60,
      minutes: Math.floor(remainingTime / 60) % 60,
      hours: Math.floor(remainingTime / (60 * 60)) % 24,
      days: Math.floor(remainingTime / (60 * 60 * 24)),
    };
  }, [remainingTime]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && wentBackgroundAt && running) {
        const diff = (Date.now() - wentBackgroundAt) / 1000.0;
        setRemainingTime(Math.max(0, remainingTime - diff));
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
    if (!running) return;

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          onFinish?.();
          return 0;
        }
        const newTime = prevTime - 1;
        onChange?.(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, onChange, onFinish]);

  const renderDigit = (digit: string) => (
    <View style={[styles.digitCont, { width: size * 2.3, height: size * 2.6 }, digitStyle]}>
      <Text style={[styles.digitTxt, { fontSize: size }, digitTxtStyle]}>{digit}</Text>
    </View>
  );

  const renderLabel = (label: string) => {
    if (!label) return null;
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
    borderRadius: 5,
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
