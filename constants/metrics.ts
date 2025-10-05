import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const Metrics = {
  screenWidth,
  screenHeight,
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 32,
  },
  iconSize: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
  },
  touchableOpacity: 0.7,
  statusBarHeight: Platform.select({
    ios: 44,
    android: 24,
    default: 0,
  }),
} as const;