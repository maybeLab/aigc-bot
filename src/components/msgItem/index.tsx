import { TMessageRoles } from "@/types";

import MsgItemMine from "./mine";
import MsgItemBot from "./bot";

interface IProps {
  type: TMessageRoles;
  content: string;
}

export default function MsgItem(props: IProps) {
  if (props.type === "user") {
    return <MsgItemMine content={props.content}></MsgItemMine>;
  }
  return <MsgItemBot {...props}></MsgItemBot>;
}
