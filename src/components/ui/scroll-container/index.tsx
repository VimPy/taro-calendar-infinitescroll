import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import BScroll from 'better-scroll'

type ScrollContainerProp = {
  refreshId: number;
  height: string;
  pageIndex?: number;
  totalPage?: number;
  onHandlePullUp: () => any;
}
type ElementParam = HTMLElement | string;

export default class ScrollContainer extends Taro.Component<ScrollContainerProp> {
  scroll: any
  constructor(props: ScrollContainerProp) {
    super(props)
    this.state = {}
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.refreshId !== nextProps.refreshId && this.scroll) {
      setTimeout(() => {this.scroll.refresh()}, 40)
    }
  }
  componentDidMount() {
    const wrapper = document.querySelector('.wrapper')
    let initParam = {
      scrollX: false,
      click: true,  // better-scroll 默认会阻止浏览器的原生 click 事件
      scrollY: true, // 关闭竖向滚动
      bounce : {
        top: false,
        bottom: false,
      },
      useTransition: false,
      pullUpLoad: {threshold: 80, stop: 100},
    }
    
    initParam.bounce.bottom = true
    // 选中DOM中定义的 .wrapper 进行初始化
    this.scroll = new BScroll(wrapper as ElementParam, initParam)
    this.scroll.on('pullingUp', () => {
      let {pageIndex, totalPage, onHandlePullUp} = this.props
      // 滚动到底部
      if(pageIndex && totalPage && pageIndex === totalPage) {
        this.scroll.finishPullUp()
        return
      }
      onHandlePullUp()
      this.scroll.finishPullUp()
    })
  }

  render() {
    return (
      <View className='wrapper-container'>
        <View className='wrapper' style={{height: this.props.height}}>
          <View>
            {this.props.children}
          </View>
        </View>
      </View>
    )
  }
}
