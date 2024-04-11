const { app } = require('electron')

const isPackaged = app.isPackaged

module.exports = {
  // 是否是生产环境
  isPackaged,
  // 系统信息
  platform: process.platform
}
