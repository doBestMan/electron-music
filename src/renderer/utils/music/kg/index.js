import leaderboard from './leaderboard'
import api_source from '../api-source'


const kg = {
  leaderboard,
  getMusicUrl(songInfo, type) {
    return api_source('kg').getMusicUrl(songInfo, type)
  },
  getLyric(songInfo) {
    return api_source('kg').getLyric(songInfo)
  },
  getPic(songInfo) {
    return api_source('kg').getPic(songInfo)
  },
}

export default kg
