import { app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
import mainWinDimensions from 'common/mainWinDimensions'
import mainWinContent from 'common/mainWinContent'
import mainWinIcon from 'common/mainWinIcon'
import mainWinMenu from 'common/mainWinMenu'

let mainWin

const gotTheLock = app.requestSingleInstanceLock()
const inDev = process.env.NODE_ENV === 'development'

autoUpdater.checkForUpdatesAndNotify()

function createMainWin() {
  const [width, height] = mainWinDimensions()

  mainWin = new BrowserWindow({
    width,
    height,
    title: 'Exam Simulator',
    icon: mainWinIcon,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWin.loadURL(mainWinContent(inDev))
  mainWin.setMenu(mainWinMenu())

  installReactDevtools(inDev)

  mainWin.on('close', () => {
    mainWin = null
  })
}

/**
 * Try to load React DevTools from the user's Chrome profile to avoid CRX download/unzip.
 * Works with Electron 4 via BrowserWindow.addDevToolsExtension (deprecated but available).
 * Returns true if successfully loaded.
 */
function addReactDevToolsFromChrome() {
  try {
    const fs = require('fs')
    const path = require('path')
    const REACT_DEVTOOLS_ID = 'fmkadmapgofadopljbjfkapdkoienihi'

    // Candidate base directories for the unpacked Chrome extension
    const candidates = []

    // Windows (LOCALAPPDATA)
    if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
      candidates.push(path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'User Data', 'Default', 'Extensions', REACT_DEVTOOLS_ID))
    }
    // macOS
    if (process.platform === 'darwin' && process.env.HOME) {
      candidates.push(path.join(process.env.HOME, 'Library', 'Application Support', 'Google', 'Chrome', 'Default', 'Extensions', REACT_DEVTOOLS_ID))
    }
    // Linux
    if (process.platform === 'linux' && process.env.HOME) {
      candidates.push(path.join(process.env.HOME, '.config', 'google-chrome', 'Default', 'Extensions', REACT_DEVTOOLS_ID))
      // Some distros use chromium or different profiles; add a couple more common paths
      candidates.push(path.join(process.env.HOME, '.config', 'chromium', 'Default', 'Extensions', REACT_DEVTOOLS_ID))
    }

    for (const base of candidates) {
      try {
        const fs = require('fs')
        const versions = fs.readdirSync(base)
          .filter((v) => fs.existsSync(path.join(base, v, 'manifest.json')))
          .sort()
          .reverse() // pick highest version
        for (const v of versions) {
          const extDir = path.join(base, v)
          const name = BrowserWindow.addDevToolsExtension(extDir)
          console.log('Loaded React DevTools from:', extDir, '->', name)
          return true
        }
      } catch (_) {
        // try next candidate
      }
    }
  } catch (err) {
    // ignore and report failure
  }
  return false
}

function installReactDevtools(inDev) {
  if (!inDev || !mainWin) return

  // Always open DevTools in dev
  mainWin.webContents.openDevTools({ mode: 'detach' })

  // Preferred path: load unpacked extension from Chrome
  const loadedFromChrome = addReactDevToolsFromChrome()
  if (loadedFromChrome) return

  // Fallback: attempt electron-devtools-installer, but don’t crash the app if it fails
  try {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS
    } = require('electron-devtools-installer')

    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Installed --> ${name}`))
      .catch((err) => console.log('DevTools installer failed (ignored):', err && err.message || err))
  } catch (e) {
    console.log('DevTools installer unavailable (ignored):', e && e.message || e)
  }
}

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWin) {
      if (mainWin.isMinimized()) {
        mainWin.restore()
      }
      mainWin.focus()
    }
  })
  app.on('ready', createMainWin)
}

app.on('window-all-closed', () => app.quit())
