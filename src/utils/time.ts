//封装函数：获取当前时间段
export const getTime = () => {
    let message = ''
    //通过内置构造函数Date
    const hour = new Date().getHours()
    if (hour <= 9) {
        message = '早上'
    } else if (hour <= 14) {
        message = '上午'
    } else if (hour <= 18) {
        message = '下午'
    } else {
        message = '晚上'
    }
    return message
}