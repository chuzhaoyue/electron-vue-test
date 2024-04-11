// electron/main.js
const { app, BrowserWindow, dialog } = require('electron')
const path = require('path')
// 因为 window.js 引入了 urils.js，如果先引入 utils.js，再引入 window.js，生产环境下 window.js 中从 utils.js 引入的变量就会取不到值
const { createWindow } = require('./window.js')
const { isPackaged, platform } = require('./utils.js')

// 主窗口
let mainWindow;

function createMainWindow() {
  // 创建浏览器窗口
  mainWindow = createWindow(
    'main',
    {
      width: 800,
      height: 600,
      // 设置窗口尺寸为屏幕工作区尺寸
      // width: screen.getPrimaryDisplay().workAreaSize.width,
      // height: screen.getPrimaryDisplay().workAreaSize.height,
      // 设置最小尺寸
      minWidth: 800,
      minHeight: 600
    },
    isPackaged
      ? `file://${path.join(__dirname, '../dist/index.html')}`
      : 'http://localhost:3004/'
  )

  // 在窗口要关闭的时候触发
  mainWindow.on('close', (e) => {
    e.preventDefault()
    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: '退出提示',
        defaultId: 0,
        cancelId: 1,
        message: '确定要退出吗？',
        buttons: ['退出', '取消']
      })
      .then(async (res) => {
        if (res.response === 0) {
          // e.preventDefault(); //阻止默认行为，一定要有
          // mainWindow.destroy();
          app.exit(0) //exit()直接关闭客户端，不会执行quit();
        }
      })
  })
}

// 限制只能打开一个窗口
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // 当运行第二个实例时,将会聚焦到 mainWindow 这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
      // mainWindow.show();
    }
  })
  // 这段程序将会在 Electron 结束初始化和创建浏览器窗口的时候调用
  // 部分 API 在 ready 事件触发后才能使用
  app.whenReady().then(() => {
    createMainWindow()

    app.on('activate', () => {
      // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
      // 打开的窗口，那么程序会重新创建一个窗口。
      if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
  })
}

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', () => {
  if (platform !== 'darwin') app.quit()
})

// 开发环境禁止证书报错
// https://stackoverflow.com/questions/49637026/mainwindow-loadurlhttps-localhost3000-show-white-screen-on-electron-app/49673272
if (!isPackaged) {
  // 证书的链接验证失败时，触发该事件
  app.on('certificate-error', function (event, webContents, url, error, certificate, callback) {
    event.preventDefault()
    callback(true)
  })
}
