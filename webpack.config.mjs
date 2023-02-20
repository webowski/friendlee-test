import path, { resolve } from 'path'
import fs from 'fs-extra'
import PugPlugin from 'pug-plugin'

const __dirname = resolve()
const mode = process.env.NODE_ENV || 'development'
const target = mode === 'development' ? 'web' : 'browserslist'

const templates = fs
	.readdirSync(path.join(__dirname, 'src/templates'))
	.reduce((entries, file) => {
		if (path.extname(file) === '.pug') {
			let tplName = path.parse(file).name
			let tplPath = path.join(__dirname, 'src/templates', file)
			entries[tplName] = tplPath
		}
		return entries
	}, {})

export default {
	mode: mode,
	target: target,

	entry: {
		...templates,
	},

	output: {
		path: path.join(__dirname, 'dist/'),
		filename: 'scripts/[name].js',
		clean: true,
	},

	module: {
		rules: [
			// Styles
			{
				test: /\.(scss|css)$/i,
				use: [
					{
						loader: 'css-loader',
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									['autoprefixer']
								],
							},
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								includePaths: ['node_modules'],
							},
						},
					},
				],
			},

			// Scripts
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},

			// Fonts
			{
				test: /\.(woff|woff2)$/i,
				type: 'asset/resource',
				generator: {
					filename: (pathData) => {
						let relativePath = pathData.module.resourceResolveData.relativePath
						let dirName = path.dirname(relativePath).replace('./src/', '')
						return dirName + '/[name][ext]'
					},
				},
			},

			// Templates
			{
				test: /\.pug$/,
				loader: PugPlugin.loader,
				options: {
					method: 'render',
					embedFilters: {},
				},
			},
		],
	},

	plugins: [
		new PugPlugin({
			pretty: true,
			css: {
				filename: 'styles/[name].min.css',
			},
			js: {
				filename: 'scripts/[name].min.js',
			},
		}),
	],

	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			'~': path.join(__dirname, 'src/'),
		},
	},

	devtool: mode === 'development' ? 'source-map' : false,
	performance: {
		hints: false,
	},

	watchOptions: {
		ignored: '**/node_modules',
	},

	devServer: {
		open: false,
		liveReload: true,
		hot: false,
		port: 3000,
		static: {
			directory: resolve(__dirname, 'dist'),
			staticOptions: {},
			publicPath: resolve(__dirname, 'dist'),
			serveIndex: true,
			watch: false,
		},
	},
}
