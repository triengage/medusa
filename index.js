/*

https://jsfiddle.net/xlaptop2001/68nLknav/

*/

'use strict';
const electron = require('electron')
	, request = require('request')
	, $ = require('jquery')
	;

const {app, Menu} = require('electron')


// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		icon: '',
		titleBarStyle: 'hidden',
		frame: false,
		width: 1281,
		height: 600,
		minWidth: 800,
		minHeight: 600,
		"web-preferences" : {
			"webaudio" : true,
			"webgl" : true,
			"blinkFeatures" : "Accelerated2dCanvas, ExperimentalCanvasFeatures,FrameTimingSupport, SlimmingPaintV2, SpeculativeLaunchServiceWorker"
		}
	});

	win.loadURL(`file://${__dirname}/content.html`);

	win.webContents.on('did-finish-load', function () {
		//win.webContents.send('ping', body);
	});


	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
	mainWindow.$ = $;
});



/**
 * Context Menu
 */

const template = [
	{
	  label: 'Edit',
	  submenu: [
		{role: 'undo'},
		{role: 'redo'},
		{type: 'separator'},
		{role: 'cut'},
		{role: 'copy'},
		{role: 'paste'},
		{role: 'pasteandmatchstyle'},
		{role: 'delete'},
		{role: 'selectall'}
	  ]
	},
	{
	  label: 'View',
	  submenu: [
		{role: 'reload'},
		{role: 'forcereload'},
		{role: 'toggledevtools'},
		{type: 'separator'},
		{role: 'resetzoom'},
		{role: 'zoomin'},
		{role: 'zoomout'},
		{type: 'separator'},
		{role: 'togglefullscreen'}
	  ]
	},
	{
	  role: 'window',
	  submenu: [
		{role: 'minimize'},
		{role: 'close'}
	  ]
	},
	{
	  role: 'help',
	  submenu: [
		{
		  label: 'Learn More',
		  click () { require('electron').shell.openExternal('https://electronjs.org') }
		}
	  ]
	}
  ]

  if (process.platform === 'darwin') {
	template.unshift({
	  label: app.getName(),
	  submenu: [
		{role: 'about'},
		{type: 'separator'},
		{role: 'services', submenu: []},
		{type: 'separator'},
		{role: 'hide'},
		{role: 'hideothers'},
		{role: 'unhide'},
		{type: 'separator'},
		{role: 'quit'}
	  ]
	})

	// Edit menu
	template[1].submenu.push(
	  {type: 'separator'},
	  {
		label: 'Speech',
		submenu: [
		  {role: 'startspeaking'},
		  {role: 'stopspeaking'}
		]
	  }
	)

	// Window menu
	template[3].submenu = [
	  {role: 'close'},
	  {role: 'minimize'},
	  {role: 'zoom'},
	  {type: 'separator'},
	  {role: 'front'}
	]
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)