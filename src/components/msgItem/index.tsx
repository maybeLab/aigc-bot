import { TMessageRoles } from "@/context/messageList";

import MsgItemMine from "../msgItemMine";
import MsgItemBot from "../msgItemBot";

function MsgItem(props: { type: TMessageRoles; content: string }) {
  return (
    <div>
      {props.type === "user" ? (
        <MsgItemMine content={props.content}></MsgItemMine>
      ) : (
        <MsgItemBot {...props}></MsgItemBot>
      )}
    </div>
  );
}

export default MsgItem;
