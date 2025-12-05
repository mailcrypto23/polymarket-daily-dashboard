import markets from '../mock-data/markets.json'

export default {
  async getMarkets(){ return new Promise(res=> setTimeout(()=>res(markets.slice(0,8)),200)) }
}
