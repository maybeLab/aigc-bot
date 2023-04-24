import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Typography, Button } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import Store from "@/context";

export default React.memo(function ChatStarter() {
  const navgate = useNavigate();

  const { state } = React.useContext(Store);

  const toDefaultConversation = React.useCallback(() => {
    navgate(`/chat/${state.conversations[0].id}`, { replace: true });
  }, [navgate, state]);

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
        width="200"
        height="200"
      />
      <Typography variant="body1" color={blueGrey[600]} sx={{ mt: 4 }}>
        Your every idea perfect!
      </Typography>
      <Button
        onClick={toDefaultConversation}
        size="large"
        variant="outlined"
        sx={{ mt: 4 }}
      >
        Start
      </Button>
    </Box>
  );
});
