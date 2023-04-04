import { memo } from "react";
import "./index.scss";
function MsgItemMine(props: any) {
  return (
    <div className="msgItemMine">
      <div className="wrapper">
        <div className="msg">
          <pre>{props.content}</pre>
        </div>
        <div className="avatar">
          <img
            src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202105%2F19%2F20210519212438_ced7e.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1680255235&t=54ea1abfcf119ff864e69f0f2201390d"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default memo(MsgItemMine);
