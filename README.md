# React Native Countdown Component

A customizable countdown component for React Native applications. This component provides a flexible and customizable countdown timer with support for days, hours, minutes, and seconds.

## Preview

### Basic Countdown
![Basic Countdown Example](./assets/example1.gif)

### Custom Styled Countdown
![Custom Countdown Example](./assets/example2.gif)

## Features

- Customizable time units (Days, Hours, Minutes, Seconds)
- Configurable digit and label styles
- Support for separators between time units
- Background state handling
- TypeScript support
- Flexible styling options

## Installation

```bash
# Using npm
npm install react-native-countdown-eggmun

# Using yarn
yarn add react-native-countdown-eggmun
```

## Usage

```tsx
import React from 'react';
import { View } from 'react-native';
import CountDown from 'react-native-countdown-eggmun';

const App = () => {
  return (
    <View>
      <CountDown
        until={3600} // seconds
        onFinish={() => console.log('Countdown finished!')}
        size={20}
        timeToShow={['H', 'M', 'S']}
        timeLabels={{ h: 'Hours', m: 'Minutes', s: 'Seconds' }}
      />
    </View>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| until | number | required | Number of seconds to count down |
| onChange | (until: number) => void | - | Callback when countdown changes |
| onFinish | () => void | - | Callback when countdown finishes |
| onPress | () => void | - | Callback when countdown is pressed |
| running | boolean | true | Whether the countdown is running |
| size | number | 15 | Size of the digits |
| digitStyle | object | { backgroundColor: '#FAB913' } | Style for the digit container |
| digitTxtStyle | object | { color: '#000' } | Style for the digit text |
| timeLabelStyle | object | { color: '#000' } | Style for the time labels |
| separatorStyle | object | { color: '#000' } | Style for the separator |
| timeToShow | string[] | ['D', 'H', 'M', 'S'] | Which time units to show |
| showSeparator | boolean | false | Whether to show separators between time units |
| timeLabels | object | { d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds' } | Labels for time units |

## Complete Example

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import CountDown from 'react-native-countdown-eggmun';

const Example = () => {
  return (
    <View style={styles.container}>
      <CountDown
        until={86400} // 24 hours
        size={25}
        timeToShow={['D', 'H', 'M', 'S']}
        timeLabels={{ d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds' }}
        digitStyle={{ backgroundColor: '#1B5E20' }}
        digitTxtStyle={{ color: '#fff' }}
        timeLabelStyle={{ color: '#1B5E20' }}
        separatorStyle={{ color: '#1B5E20' }}
        showSeparator
        onFinish={() => console.log('Countdown finished!')}
        style={styles.countdown}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  countdown: {
    padding: 20,
  },
});

export default Example;
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 