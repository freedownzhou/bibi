import moneyRecord from '../assets/data/moneyRecord'

let Status = {
  convert (type, status) {
    switch (type) {
      case 'MoneyRecord':
        return moneyRecord[status] || '状态未知'
    }
  },
  install (Vue, options) {
    Vue.Status = Status
    Vue.prototype.Status = Status
  }
}
export default Status
