
import {
  Platform,
  StyleSheet,
} from 'react-native';

const color = {
  black: "#1d1f21",
  very_dark_gray: "#282a2e", // 01
  dark_gray: "#373b41", // 02
  gray: "#969896", // 03
  light_gray: "#b4b7b4", // 04
  very_light_gray: "#c5c8c6", // 05
  almost_white: "#e0e0e0", // 06
  white: "#ffffff", // 07
  red: "#cc6666", // 08
  orange: "#de935f", // 09
  yellow: "#f0c674", // 0A
  green: "#b5bd68", // 0B
  cyan: "#8abeb7", // 0C
  blue: "#81a2be", // 0D
  purple: "#b294bb", // 0E
  brown: "#a3685a", // 0F
  test:"#212121"
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.test,
  },
});

export default styles
