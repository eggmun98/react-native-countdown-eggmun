export interface CountDownProps {
    id?: string;
    digitStyle?: object;
    digitTxtStyle?: object;
    timeLabelStyle?: object;
    separatorStyle?: object;
    timeToShow?: string[];
    showSeparator?: boolean;
    size?: number;
    until: number;
    autoRestart?: boolean;
    onChange?: (until: number) => void;
    onPress?: () => void;
    onFinish?: () => void;
    running?: boolean;
    style?: object;
    timeLabels?: {
      d: string;
      h: string;
      m: string;
      s: string;
    };
  }