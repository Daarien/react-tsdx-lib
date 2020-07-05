import createTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { green, indigo, red } from './colors';

const options: ThemeOptions = {
  palette: {
    primary: {
      light: green[300],
      main: green[500],
      dark: green[700],
      contrastText: 'white',
    },
    secondary: {
      light: indigo[300],
      main: indigo[500],
      dark: indigo[700],
    },
    error: {
      light: red[300],
      main: red[500],
      dark: red[700],
    },
  },
};

const defaultTheme = createTheme(options);

export default defaultTheme;
