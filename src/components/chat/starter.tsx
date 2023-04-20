import React from "react";
import { Box, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

export default React.memo(function ChatStarter() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        mt: -8,
      }}
    >
      <img
        src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Hundred%20Points.png"
        alt="Hundred Points"
        width="250"
        height="250"
      />
      <Typography variant="body1" color={blueGrey[600]} sx={{ mt: 4 }}>
        Your every idea perfect!
      </Typography>
    </Box>
  );
});
