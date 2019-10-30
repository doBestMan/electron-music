import { httpGet } from '../../request'

if (!window.kw_token) {
  window.kw_token = {
    token: null,
    isGetingToken: false,
  }
}

export const formatSinger = rawData => rawData.replace(/&/g, '、')

export const matchToken = headers => {
  try {
    return headers['set-cookie'][0].match(/kw_token=(\w+)/)[1]
  } catch (err) {
    return null
  }
}

export const getToken = () => new Promise((resolve, reject) => {
  if (window.kw_token.isGetingToken) reject(new Error('正在获取token'))
  window.kw_token.isGetingToken = true
  httpGet('http://www.kuwo.cn', (err, resp) => {
    window.kw_token.isGetingToken = false
    if (err) return reject(err)
    if (resp.statusCode != 200) return reject(new Error('获取失败'))
    const token = window.kw_token.token = matchToken(resp.headers)
    resolve(token)
  })
})
