import MsgItemMine from '../msgItemMine'
import MsgItemBot from '../msgItemBot'

function MsgItem(props:any) {
  return (
    <div>
      {props.type===1 && <MsgItemMine msg={props.msg}></MsgItemMine>}
      {props.type===2 && <MsgItemBot {...props}></MsgItemBot>}
    </div>
  )
}

export default MsgItem;
