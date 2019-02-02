// styledComponents supoport for typings

// -----------------------------------------------------------------------------
// IMPORTS

/** NPM */
import * as styledComponents from "styled-components";
import { ThemedStyledComponentsModule } from "styled-components";

// -----------------------------------------------------------------------------
interface ThemeInterface {}

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider
} = styledComponents as ThemedStyledComponentsModule<ThemeInterface>;

export { css, createGlobalStyle, keyframes, ThemeProvider };
export default styled;
