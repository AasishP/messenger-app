import { ButtonBase, withStyles } from "@material-ui/core";
import React from "react";
const styles = {
  buttonRipple: { color: "#f00" },
};

const Conversation = withStyles(styles)((props) => (
  <ButtonBase
    TouchRippleProps={{ classes: { root: props.classes.buttonRipple } }}
    component="div"
  >
    Click me
  </ButtonBase>
));
