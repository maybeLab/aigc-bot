import React from "react";

import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

export default React.memo(function MessageLoading() {
  return (
    <>
      {Array.from(new Array(5)).map((_, index) => {
        return (
          <Box key={index}>
            <ListItem
              alignItems="center"
              sx={{ justifyContent: "flex-end", pl: 8 }}
            >
              <Skeleton width="100%">
                <Typography variant="body2">.</Typography>
              </Skeleton>
              <Skeleton variant="circular" sx={{ marginLeft: 2 }}>
                <Avatar />
              </Skeleton>
            </ListItem>
            <ListItem alignItems="center" sx={{ pr: 8 }}>
              <Skeleton variant="circular" sx={{ marginRight: 2 }}>
                <Avatar />
              </Skeleton>
              <Skeleton width="100%">
                <Typography variant="body2">.</Typography>
              </Skeleton>
            </ListItem>
          </Box>
        );
      })}
    </>
  );
});
