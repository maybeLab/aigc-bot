import { memo } from "react";

import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

function MsgItemMine(props: any) {
  return (
    <ListItem alignItems="center" sx={{ justifyContent: "flex-end", pl: 8 }}>
      <Typography variant="body2">{props.content}</Typography>
      <Avatar
        sx={{ marginLeft: 2 }}
        src="https://mui.com/static/images/avatar/1.jpg"
      ></Avatar>
    </ListItem>
  );
}

export default memo(MsgItemMine);
