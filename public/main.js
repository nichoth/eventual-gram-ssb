const { app, BrowserWindow } = require('electron')
const {  fork } = require('child_process');
// var path = require('path')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // console.log('env', process.env.NODE_ENV)
  var server = fork(require.resolve('../src/server.js'))

  // var appName
  // if (process.env.NODE_ENV === 'development') {
  //     appName = 'ssb-ev-DEV'
  // }
  // console.log('app name', appName)

  server.once('message', function (msg) {
    // and load the index.html of the app.
    win.loadFile('./public/index.html')
  })

  // var server = spawn('node', [path.join(__dirname, '../src/server/index.js')])
  server.on('exit', function (code, sig) {
    console.log('server exit', code, sig)
  })

  server.on('error', function (err) {
    console.log('server error', err)
  })

  app.on('will-quit', function (ev) {
    server.kill()
  })

  // server.stderr.on('data', function (err) {
  //   console.log('server err', err.toString())
  // })

  // Open the DevTools.
  // win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
