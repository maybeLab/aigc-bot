import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import AddIcon from "@mui/icons-material/Add";

import AddDialog from "./add";

import Store, { initialState } from "@/context";

import { EModifyType, IConversation } from "@/types";

interface IProps {
  list: IConversation[];
  onAdd: (data: IConversation) => void;
  onNav?: () => void;
}

export default React.memo(function Conversations(props: IProps) {
  const { state, dispatch } = useContext(Store);

  let { conversationId } = useParams();

  React.useEffect(() => {
    const currentBot =
      props.list.find(({ id }) => id === conversationId) ||
      initialState.conversation;
    currentBot &&
      dispatch({
        type: EModifyType.SET_CONVERSATION,
        payload: currentBot,
      });
  }, [props.list, conversationId, dispatch]);

  const [dialogVisible, setDialogStatus] = React.useState(false);

  const onCloseDialog = (data?: IConversation) => {
    if (data) {
      props.onAdd(data);
    }
    setDialogStatus(false);
  };

  const navgate = useNavigate();

  const onNavgate = (path: string) => {
    navgate(path, { replace: true });
    props.onNav?.();
  };

  return (
    <>
      <Toolbar>
        <Button
          disableRipple
          size="large"
          variant="text"
          onClick={() => onNavgate(`/`)}
        >
          AIGC-BOT
        </Button>
      </Toolbar>
      <Divider />
      <List disablePadding>
        {props.list.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={conversationId === item.id}
              onClick={() => onNavgate(`/chat/${item.id}`)}
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
