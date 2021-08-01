module.exports = (env, argv) => ({
	mode         : argv.mode === "development" ? argv.mode : "production",
	target       : "electron-renderer",
	watchOptions : {
		ignored : /[/\/](node_modules)[/\/]/,
	},
	entry : {
		index : `${__dirname}/index.ts`,
	},
	output : {
		path     : `${__dirname}/dist`,
		filename : "[name].js",
	},
	module : {
		rules : [
			{
				test    : /\.ts?$/,
				use     : "ts-loader",
				exclude : /node_modules/,
			},
		],
	},
	resolve : {
		extensions : [".ts", ".json"],
	},
});
