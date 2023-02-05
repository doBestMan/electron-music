import { inflate } from 'zlib'
// import path from 'path'
import { mainHandle } from '@common/mainIpc'
import { WIN_MAIN_RENDERER_EVENT_NAME } from '@common/ipcNames'

// eslint-disable-next-line @typescript-eslint/dot-notation, @typescript-eslint/quotes
// const require = module[`require`].bind(module)

let qrc_decode: (buf: Buffer, len: number) => Buffer

const decode = async(str: string): Promise<string> => {
  if (!str) return ''
  const buf = Buffer.from(str, 'hex')
  return new Promise((resolve, reject) => {
    inflate(qrc_decode(buf, buf.length), (err, lrc) => {
      if (err) reject(err)
      else resolve(lrc.toString())
    })
  })
}


const handleDecode = async(lrc: string, tlrc: string, rlrc: string) => {
  if (!qrc_decode) {
    // const nativeBindingPath = path.join(__dirname, '../build/Release/qrc_decode.node')
    // const nativeBindingPath = isDev ? path.join(__dirname, '../build/Release/qrc_decode.node')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const addon = require('qrc_decode.node')
    // console.log(addon)
    qrc_decode = addon.qrc_decode
  }

  const [lyric, tlyric, rlyric] = await Promise.all([decode(lrc), decode(tlrc), decode(rlrc)])
  return {
    lyric,
    tlyric,
    rlyric,
  }
}


export default () => {
  mainHandle<{ lrc: string, tlrc: string, rlrc: string }, { lyric: string, tlyric: string, rlyric: string }>(WIN_MAIN_RENDERER_EVENT_NAME.handle_tx_decode_lyric, async({ params: { lrc, tlrc, rlrc } }) => {
    return handleDecode(lrc, tlrc, rlrc)
  })
}
