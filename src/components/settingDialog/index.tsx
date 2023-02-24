import { useState } from 'react'
import GlobalSetting from "./globalSetting";
import './index.scss'

function SettingDialog(props: any) {
  const [botMsg, setBotMsg] = useState<string>('')
  const handleBotMessage = (event: any) => {
    let msg = event.target.value;
    setBotMsg(msg)
  }
  const botSend=()=>{
    props.simulateBotSendMsgFn(botMsg)
    setBotMsg('')
  }
  return <div className='settingDialog'>
    <GlobalSetting />
    {/* <p className='label'>Simulate bot sending message</p>
    <div className='form'>
      <input type="text" className='simulateIpt' onChange={handleBotMessage} value={botMsg} />
      <div className='btnBotSend' onClick={botSend}>send</div>
    </div> */}
  </div>
}

export default SettingDialog