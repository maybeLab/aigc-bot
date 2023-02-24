
import './index.scss'
function TopBar(props: any) {
  return <div className='topBar'>
    <div className="left"></div>
    <div className="barTitle">{props.title}</div>
    <div className="right">
      <div className="btnSetting" onClick={() => { props.settingFn() }}>
        <i className='iconfont icon-setting-filling'></i>
      </div>
    </div>
  </div>
}

export default TopBar