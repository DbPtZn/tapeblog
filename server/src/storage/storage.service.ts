import { Injectable } from '@nestjs/common'
import { ObjectId } from 'mongodb'
import * as path from 'path'
import * as fs from 'fs'
import randomstring from 'randomstring'
// import ffmpeg from 'fluent-ffmpeg'
// import audioconcat from 'audioconcat'
type Category = 'product' | 'audio' | 'image'
const __rootdirname = process.cwd()
@Injectable()
export class StorageService {
  /**
   * 获取用户目录（不存在时自动创建）
   * @param __rootdirname 用户根目录
   * @param prv 是否为私密文件夹
   * @returns 文件存储目录
   */
  getUserDir(dirname: string, prv = false) {
    const dirPath = path.join(__rootdirname, prv ? 'private' : 'public', dirname)
    // console.log(dirPath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    return dirPath
  }

  /** 获取用户目录下的指定二级文件夹（不存在时自动创建） */
  getDocDir(dirname: string, category: Category, prv = false) {
    const userDir = this.getUserDir(dirname, prv)
    // console.log(userDir)
    const dirPath = `${userDir}/${category}`
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    return dirPath
  }

  getFilePath(args: { filename: string; dirname: string; category: Category; prv?: boolean }) {
    const { dirname, category, filename, prv } = args
    const dirPath = this.getDocDir(dirname, category, prv)
    return `${dirPath}/${filename}`
  }

  /**
   * 根据给定信息创建文件路径
   * @param dirname 目录名称
   * @param category 类目
   * @param originalname 原生文件名（或自定义文件名）（可选: 未传参时会根据当前时间自动生成文件名）
   * @param extname 拓展名
   * @returns filename: 文件名  filepath: 文件地址
   */
  createFilePath(args: {
    dirname: string
    category: Category
    originalname?: string
    extname: string | '.mp3' | '.wav' | '.txt' | '.json'
    prv?: boolean
  }) {
    const { dirname, category, originalname, extname, prv } = args
    const dirPath = this.getDocDir(dirname, category, prv)
    const filename = `${originalname ? originalname : createDtId()}` + `${extname}`
    const filepath = dirPath + '/' + filename
    return {
      filename,
      filepath
    }
  }

  saveImage(args: { sourcePath: string; extname: string; dirname: string }) {
    return new Promise<string>((resolve, reject) => {
      const { sourcePath, extname, dirname } = args
      const { filepath } = this.createFilePath({
        dirname,
        originalname: `${randomstring.generate(3)}${new Date().getTime()}`,
        category: 'image',
        extname
      })
      // 移动文件
      fs.rename(sourcePath, filepath, err => {
        if (err) {
          // console.error('移动文件时发生错误:', err)
          reject(err)
        } else {
          // console.log('文件移动成功!')
          resolve(filepath)
        }
      })
    })
  }

  /** 复制文件 */
  copyFile(sourcePath: string, targetPath: string, callback: (err) => void) {
    return fs.copyFile(sourcePath, targetPath, callback)
  }

  /** 同步复制文件 */
  copyFileSync(sourcePath: string, targetPath: string) {
    return fs.copyFileSync(sourcePath, targetPath)
  }

  /**
   * 音频格式化处理
   * @param sourcePath 源文件路径（可以是指向资源文件的路径也可以是文件数据），此方法会自动删除源文件 sourcePath指向的资源文件
   * @param targetPath 存储目标资源文件的路径 (会在目标路径创建一个资源文件)
   */
  // audioformat(sourcePath: string, targetPath: string) {
  //   // console.log(sourcePath)
  //   // console.log(targetPath)
  //   return new Promise<string>((resolve, reject) => {
  //     try {
  //       ffmpeg()
  //         .input(sourcePath)
  //         .outputOptions('-ac 1')
  //         .outputOptions('-ab 16k')
  //         .outputOptions('-ar 16000')
  //         .outputOptions('-acodec libmp3lame')
  //         .save(targetPath)
  //         .on('end', function () {
  //           console.log(targetPath)
  //           fs.unlinkSync(sourcePath)
  //           resolve(targetPath)
  //         })
  //         .on('error', function (err) {
  //           console.log(err)
  //           reject(err)
  //         })
  //     } catch (error) {
  //       console.log(error)
  //       reject(error)
  //     }
  //   })
  // }

  // concatAudio(audioPathGroup: string[], targetPath: string) {
  //   return new Promise((resolve, reject) => {
  //     audioconcat(audioPathGroup)
  //       .concat(targetPath)
  //       // .outputOptions('-ac 1')
  //       // .outputOptions('-ab 16k')
  //       // .outputOptions('-ar 16000')
  //       .outputOptions('-acodec libmp3lame')
  //       .on('start', function (command) {
  //         // console.log('ffmpeg project started:', command)
  //       })
  //       .on('error', function (err, stdout, stderr) {
  //         // console.error('Error:', err)
  //         // console.error('ffmpeg stderr:', stderr)
  //         reject(err)
  //       })
  //       .on('end', function (output) {
  //         // console.error('Audio created in:', output)
  //         resolve(targetPath)
  //       })
  //   })
  // }

  deleteSync(filePath: string) {
    return fs.unlinkSync(filePath)
  }

  delete(filePath: string, callback: (err) => void) {
    return fs.unlink(filePath, callback)
  }
}

/**根据时间戳生成随机数*/
function createDtId() {
  const d = new Date()
  let year: any = d.getFullYear()
  let month: any = d.getMonth() + 1
  let date: any = d.getDate()
  const day = d.getDay()
  let hours: any = d.getHours()
  let minutes: any = d.getMinutes()
  let seconds: any = d.getSeconds()
  const ms = d.getMilliseconds()
  year = (year + '').substring(2)
  if (month <= 9) month = '0' + month
  if (date <= 9) date = '0' + date
  if (hours <= 9) hours = '0' + hours
  if (minutes <= 9) minutes = '0' + minutes
  if (seconds <= 9) seconds = '0' + seconds
  const num = Math.ceil(Math.random() * 100)
  const id = year + month + date + hours + minutes + seconds + num
  return id
}

// async createAudioFile(args: {
//   dirname: string
//   dirName: string
//   type: 'tts' | 'asr'
//   fragmentId: string
//   extname?: '.mp3' | '.wav'
//   path?: string
//   isFormat?: boolean
// }) {
//   const { dirname, dirName, type, fragmentId, extname, path, isFormat } = args
//   const dirPath = this.getDocDir(dirname, dirName)
//   const fileName = `/${type}_${fragmentId || createDtId()}`
//   const filePath = dirPath + fileName + `${extname || '.mp3'}`
//   if (path) {
//     if (isFormat) {
//       await this.audioformat(path, filePath)
//     } else {
//       // fs.writeFileSync(filePath, data.path)
//       fs.copyFileSync(data.path, filePath)
//     }
//   }
//   return filePath
// }
/** 在指定目录下创建文件 */
// createTextFile(dirname: string, folderName: FolderName, content?: string) {
//   const dirPath = this.getDocDir(dirname, folderName, true)
//   const filename = `${createDtId()}.txt`
//   // console.log(dirPath)
//   const filePath = `${dirPath}/${filename}`
//   // console.log(filePath)
//   fs.writeFileSync(filePath, content ? content : `<br>`)
//   return {
//     filePath,
//     filename
//   }
// }

// getAudioFilePath(args: { filename: string; dirname: string }) {
//   const { filename, dirname } = args
//   const dirpath = this.getDocDir(dirname, 'audio')
//   const filePath = `${dirpath}/${filename}`
//   return filePath
// }

// getTextFile(filePath: string) {
//   return fs.readFileSync(filePath, 'utf8')
// }

/** 检查目录，如果不存在则创建 */
// checkDirAndCreate(dirPath: string) {
//   if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath, { recursive: true })
//   }
// }

// updateTextFile(filePath: string, content: string) {
//   fs.writeFileSync(filePath, content)
// }
