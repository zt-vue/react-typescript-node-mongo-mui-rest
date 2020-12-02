import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#323232',
    },
    secondary: {
      main: green[500],
    },
    background: {
      default: '#fff',
    },
  },
});
export default theme;
