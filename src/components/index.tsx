import Taro, { useState,useEffect } from '@tarojs/taro';
import { View } from '@tarojs/components';
import DayList from './ui/day-list';
import DateList from './ui/date-list';
import ScrollContainer from './ui/scroll-container';
import _generateCalendarGroup from './common/helper';
import dayjs from 'dayjs';
import '../style/index.scss';

export default function InfiniteCalendar() {
  let [calendarData,setCalendarData] = useState([] as Array<{list: any[],value: any}>);
  let [pageDate,setPageDate] = useState(Date.now());

  useEffect(()=>{
    getCalendarData();
  }, []);

  const generateFunc = _generateCalendarGroup({
    showOtherMonthDate: false,
  });
  const handleClickDay = (item) => {
    let tempData = calendarData;
    tempData.forEach((elem) => {
      elem.list.forEach(listItem => {
        if (item.value === listItem.value) listItem.isSelected = true
        else listItem.isSelected = false
      });
    });
    setCalendarData(tempData);
  }
  const getCalendarData = () => {
    let tempData = calendarData;
    for (let i = 0; i < 3; i++) {
      let calendarItem = generateFunc(dayjs(pageDate).add(i, 'month').valueOf());
      tempData.push(calendarItem);
    }
    setCalendarData(tempData);
    setPageDate((pageDate) => dayjs(pageDate).add(3, 'month').valueOf());
  }

  return (
    <View className='infinite-calendar'>
      <DayList />
      <ScrollContainer
        onHandlePullUp={() => getCalendarData()}
        height={'94vh'}
        refreshId={calendarData.length}
      >
        {
          calendarData.map((item)=>{
            return (
              <View className='calendar-scroll-content'>
                <View className='month-show'>{dayjs(item.value).format('YYYY年MM月')}</View>
                <DateList list={item.list} onClick={(item) => handleClickDay(item)}></DateList>
              </View>
            )
          })
        }
      </ScrollContainer>
    </View>
  )
}