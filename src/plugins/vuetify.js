// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Vuetify
import { createVuetify } from "vuetify";

const BookTheme = {
  dark: false,
  colors: {
    primary: "#21409a",
    secondary: "#f37a21",
    accent: "#47121D",
    success: "#47121D",
    error: "#EE5044",
    teal: "#63BAC0",
    blue: "#196CA2",
    yellow: "#F8C545",
    darkblue: "#032F45",
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "BookTheme",
    themes: {
      BookTheme,
    },
  },
});
