import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    h3: {
      fontFamily: ['"Roboto Condensed"'].join(',')
    },
    h5: {
      fontFamily: ['"Roboto Condensed"'].join(',')
    },
    h6:{
      fontFamily: ['"Merriweather"'].join(',')
    }
  }
 })

export default theme;
