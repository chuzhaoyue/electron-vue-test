const { BrowserWindow } = require('electron')
const path = require('path')
const { isPackaged } = require('./utils.js')

// 窗口信息 { key: id }
const windows = {}

module.exports = {
  windows,

  // isMain: 是否是主窗口
  createWindow: function (key, options, loadUrl) {
    // 创建浏览器窗口
    const window = new BrowserWindow(
      Object.assign(
        {
          title: 'Electron Test',
          icon: path.resolve(__dirname, '../static/icon.ico'),
          show: false,
          webPreferences: {
            // webSecurity: false, // 关闭同源策略
            // devTools: !isPackaged,
            preload: path.join(__dirname, 'preload.js')
            // defaultFontSize: 12,
            // defaultMonospaceFontSize: 12,
          }
        },
        options
      )
    )

    windows[key] = window.id

    // 在加载页面时，渲染进程第一次完成绘制时，如果窗口还没有被显示，渲染进程会发出 ready-to-show 事件 。 在此事件后显示窗口将没有视觉闪烁：
    window.once('ready-to-show', () => {
      window.show()
    })

    function load() {
      window.loadURL(loadUrl)
    }

    if (isPackaged) {
      // 生产环境下，load 的是 html 文件，要做特殊处理。
      // 加载失败之后触发
      window.webContents.on('did-fail-load', () => {
        load()
      })

      // 当用户或页面想要导航时触发。
      // 它可能发生在 window.location 对象改变或用户点击页面上的链接时，可能会发生这种情况。
      // 当使用如 webContents.loadURL 和 webContents.back APIs 以编程方式导航时，将不会触发此事件。
      // 页面内导航也不会触发，例如点击锚点或更新 window.location.hash。 可使用 did-navigate-in-page 事件。
      window.webContents.on('will-navigate', (event) => {
        event.preventDefault()
        load()
      })
    } else {
      // 开发环境下，打开开发工具。
      window.webContents.openDevTools()
    }

    // 加载 html
    load()

    return window
  }
}
