import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import AddIcon from "@mui/icons-material/Add";

import AddDialog from "./add";

import msgListContext, { EModifyType } from "@/context/messageList";

import { IConversation, getMessages } from "@/fetch/api";

export default React.memo(function Conversations(props: {
  list: IConversation[];
  onAdd: (data: IConversation) => void;
}) {
  const { dispatch } = useContext(msgListContext);

  let { conversationId } = useParams();
  const [dialogVisible, setDialogStatus] = React.useState(false);

  const onCloseDialog = (data?: IConversation) => {
    if (data) {
      props.onAdd(data);
    }
    setDialogStatus(false);
  };

  const navgate = useNavigate();

  return (
    <>
      <Toolbar />
      <Divider />
      <List disablePadding>
        {props.list.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={conversationId === item.id}
              onClick={() => navgate(`/chat/${item.id}`, { replace: true })}
              title={conversationId}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />

        <ListItem disablePadding>
          <ListItemButton onClick={() => setDialogStatus(true)}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Robot" />
          </ListItemButton>
        </ListItem>
      </List>
      <AddDialog visible={dialogVisible} onClose={onCloseDialog} />
    </>
  );
});
