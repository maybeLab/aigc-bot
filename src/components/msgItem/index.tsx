import MsgItemMine from "../msgItemMine";
import MsgItemBot from "../msgItemBot";

export enum EMessage {
  OWN,
  OTHER,
}

function MsgItem(props: { type: EMessage; content: string }) {
  return (
    <div>
      {props.type === EMessage.OWN && (
        <MsgItemMine content={props.content}></MsgItemMine>
      )}
      {props.type === EMessage.OTHER && <MsgItemBot {...props}></MsgItemBot>}
    </div>
  );
}

export default MsgItem;
