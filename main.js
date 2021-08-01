const { app, BrowserWindow } = require("electron");

const createWindow = () => {
	const win = new BrowserWindow({
		width          : 800,
		height         : 600,
		webPreferences : {
			nodeIntegration : true,
		},
	});

	win.loadFile("index.html");

	win.removeMenu(true);
	win.webContents.openDevTools();
};

app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

try {
	require("electron-reloader")(module);
} catch (_) {}
