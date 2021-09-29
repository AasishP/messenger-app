import React,{ useState } from "react";
import { Box, Slide, Typography } from "@material-ui/core";
import theme from "../../theme";
import { CheckCircleOutline, ErrorOutlineOutlined, InfoOutlined, WarningOutlined } from "@material-ui/icons";

function Alert({ type, children }) {
  const [show, setShow] = useState(true);
  setTimeout(() => {
    setShow(false);
  }, 2000);
  return (
    <Slide direction="down" in={show} timeout={{ enter: 300, exit: 500 }}>
      <Box
        position="absolute"
        display="flex"
        top="5%"
        marginRight="auto"
        p="1em"
        borderRadius={5}
        boxShadow={5}
        bgcolor={theme.palette?.[type].main}
      >
        {type === "success" ? <CheckCircleOutline htmlColor="white" /> : null}
        {type === "info" ? <InfoOutlined htmlColor="white" /> : null}
        {type === "warning" ? <WarningOutlined htmlColor="white" /> : null}
        {type === "error" ? <ErrorOutlineOutlined htmlColor="white" /> : null}

        <Typography
          variant="body1"
          style={{ marginLeft: "0.5em", color: "white" }}
        >
          {children}
        </Typography>
      </Box>
    </Slide>
  );
}

export default Alert