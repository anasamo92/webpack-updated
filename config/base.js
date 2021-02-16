'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _miniCssExtractPlugin = require('mini-css-extract-plugin');

var _miniCssExtractPlugin2 = _interopRequireDefault(_miniCssExtractPlugin);

var _webpackBundleAnalyzer = require('webpack-bundle-analyzer');

var _WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

var _WatchMissingNodeModulesPlugin2 = _interopRequireDefault(_WatchMissingNodeModulesPlugin);

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

var _uglifyjsWebpackPlugin2 = _interopRequireDefault(_uglifyjsWebpackPlugin);

var _configBuilder = require('../webpack-utilities/config-builder');

var _configBuilder2 = _interopRequireDefault(_configBuilder);

var _envParser = require('../webpack-utilities/env-parser');

var _envParser2 = _interopRequireDefault(_envParser);

var _cssLoaderBuilder = require('../webpack-utilities/css-loader-builder');

var _cssLoaderBuilder2 = _interopRequireDefault(_cssLoaderBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Builder for basic configuration
 *
 * @param {object} environnement env variable
 * @param {object} definedVariables  variables to be defined at compiled time by webpack
 * @returns {any} a instance of config builder class
 */
var baseConfig = function baseConfig(environnement, definedVariables) {

    var parsedEnv = (0, _envParser2.default)(environnement);

    // Création de la config basique
    var config = new _configBuilder2.default();

    config._debugInfo('logEnv', environnement);
    config._debugInfo('logParsedEnv', parsedEnv);

    // Ajout du point d'entrée pour le polyfill
    if (parsedEnv.USE_POLYFILL) {
        config.addEntry('babel-polyfill');
        config.addEntry('whatwg-fetch');
    }

    // Ajout des points d'entrée pour le hot reload
    if (parsedEnv.HOT_RELOAD) {
        // config.addEntry('webpack-dev-server/client');
        config.addEntry('webpack-updated/react-dev-utils-override/webpack-hot-dev-client');
        // Errors should be considered fatal in development
        config.addEntry('react-error-overlay');
        config.addEntry('webpack/hot/only-dev-server');
        config.addEntry('react-hot-loader/patch');
    }

    // Ajout des points d'entrée pour le hot reload
    config.addEntry(parsedEnv.ENTRY_FILE_PATH);

    // Ajout du fichier
    config.setOuputPath(parsedEnv.OUTPUT_DIR, true);
    config.setAssetsPublicPath(parsedEnv.OUTPUT_PUBLIC_PATH);
    config.setFilename(parsedEnv.USE_VERSION ? parsedEnv.npm_package_name + '.' + parsedEnv.npm_package_version : parsedEnv.npm_package_name);
    config.useSourceMaps(parsedEnv.SOURCE_MAPS);
    config.setChunkFileName(parsedEnv.CHUNK_FILE_NAME);

    // Ajout des variables injectées
    if (parsedEnv.HOT_RELOAD) {
        config.addDefinedVariable('__DEV_SERVER_PROTOCOL__', JSON.stringify(parsedEnv.DEV_SERVER_PROTOCOL));
        config.addDefinedVariable('__DEV_SERVER_HOST__', JSON.stringify(parsedEnv.DEV_SERVER_HOST));
        config.addDefinedVariable('__DEV_SERVER_PORT__', JSON.stringify(parsedEnv.DEV_SERVER_PORT));
        config.addDefinedVariable('__DEV_SERVER_SUBDOMAIN__', JSON.stringify(parsedEnv.DEV_SERVER_SUBDOMAIN));
    }
    config.addDefinedVariable('__DEV__', parsedEnv.DEV ? 'true' : 'false');
    config.addDefinedVariable('__HOT_RELOAD__', parsedEnv.HOT_RELOAD ? 'true' : 'false');
    config.addDefinedVariable('__ANCHOR_CLASS__', JSON.stringify(parsedEnv.ANCHOR_CLASS));
    config.addDefinedVariable('__PACKAGE_JSON_PATH__', JSON.stringify(parsedEnv.PACKAGE_JSON_PATH));
    // config.addDefinedVariable('__USER__', JSON.stringify(USER));
    config.addDefinedVariable('__PROJECT__', JSON.stringify(parsedEnv.npm_package_name));
    config.addDefinedVariable('LEGACY_SEARCH_API', JSON.stringify(parsedEnv.LEGACY_SEARCH_API));
    config.addDefinedVariable('process.env.NODE_ENV', JSON.stringify(parsedEnv.NODE_ENV));

    for (var prop in definedVariables) {
        config.addDefinedVariable(prop, definedVariables[prop]);
    }

    // GESTION DES ALIAS
    config.addAlias('react', './node_modules/react');
    config.addAlias('react-dom', './node_modules/react-dom');
    config.addAlias('moment', './node_modules/moment');
    config.addAlias('numeral', './node_modules/numeral');
    config.addAlias('material-design-lite', './node_modules/material-design-lite');

    // GESTION DES PLUGINS
    // Les fonctions seront résolues au moment de la création de la config webpack.
    config.addPlugin(10, function () {
        return new _webpack2.default.DefinePlugin(config.getDefinedVariables());
    });
    if (!parsedEnv.HOT_RELOAD) {
        config.addPlugin(20, function () {
            return new _miniCssExtractPlugin2.default(config.getCssFilename());
        });
    }
    // Gestion du HOT_RELOAD
    if (parsedEnv.HOT_RELOAD) {
        config.addPlugin(30, new _webpack2.default.HotModuleReplacementPlugin());
    }
    if (!parsedEnv.MINIMIFY) {
        config.addPlugin(35, new _webpack2.default.NamedModulesPlugin());
    }
    // Génération d'un index HTML
    if (parsedEnv.GENERATE_HTML) {
        config.addPlugin(40, function (env) {
            return new _htmlWebpackPlugin2.default({
                inject: 'body',
                // eslint-disable-next-line
                templateContent: env.HTML_TEMPLATE(env)
            });
        });
    }

    // Gestion de la minification
    if (parsedEnv.MINIMIFY) {
        config.addPlugin(50, function (env) {
            return new _uglifyjsWebpackPlugin2.default({
                sourceMap: env.SOURCE_MAPS,
                parallel: true,
                uglifyOptions: {
                    warnings: false,
                    compress: {
                        /* eslint-disable camelcase */
                        drop_console: env.DROP_CONSOLE,
                        drop_debugger: true,
                        passes: 2,
                        keep_infinity: true,
                        ecma: env.ECMA_MODE
                        /*eslint-enable camelcase */
                    },
                    output: {
                        ecma: env.ECMA_MODE
                    }
                }
            });
        });
    }

    config.addPlugin(60, new _caseSensitivePathsWebpackPlugin2.default());
    config.addPlugin(70, new _WatchMissingNodeModulesPlugin2.default(_path2.default.join(process.cwd(), 'node_modules')));
    config.addPlugin(80, new _webpack2.default.IgnorePlugin(/^\.\/locale$/, /moment$/));

    if (parsedEnv.ANALYZE) {
        config.addPlugin(100, new _webpackBundleAnalyzer.BundleAnalyzerPlugin());
    }
    // GESTION DES LOADERS
    // Loader pour les source-map
    if (parsedEnv.SOURCE_MAPS) {
        config.addComplexLoader(10, {
            test: /\.(js|jsx)$/,
            enforce: 'pre',
            exclude: /node_modules\\css-loader/,
            loader: 'source-map-loader'
        });
    }
    // // Loader pour eslint
    // config.addComplexLoader(15, {
    //     test: /\.(js|jsx)/,
    //     enforce: 'pre',
    //     exclude: /node_modules/,
    //     loader: 'eslint-loader',
    //     options: {
    //         cache: true,
    //         emitError: false,
    //         emitWarning: false,
    //         failOnError: false,
    //         failOnWarning: false
    //     }
    // });

    // Default loader pour les fichiers inconnu
    config.addComplexLoader(15, function (env) {
        return {
            exclude: [/\.(js|jsx)$/, /\.(ts|tsx)$/, /\.css$/, /\.scss$/, /\.json$/, /\.(ttf|eot|woff|woff2|svg)(\?.*)?$/, /\.(png|jpg|jpeg|gif)(\?.*)?$/],
            loader: 'file-loader',
            options: {
                limit: env.ASSET_LIMIT,
                name: 'misc/[name]_[sha512:hash:base64:7].[ext]'
            }
        };
    });

    // Loader pour Babel (transpile ES6 => ES5, exclude des node_modules, attendus en ES5)
    // }
    var babelLoaders = [];
    if (parsedEnv.PARALLEL_BUILD) {
        babelLoaders.push({
            loader: 'thread-loader',
            options: {
                // Let's leave 2 cpus free, for plugins, OS, ...
                workers: Math.max((0, _os.cpus)().length - 2, 1)
            }
        });
    }

    if (parsedEnv.USE_CACHE) {
        babelLoaders.push({
            loader: 'cache-loader',
            options: {
                cacheIdentifier: 'cache-loader:{version} {process.env.NODE_ENV} ' + ('' + parsedEnv.LEGACY_EXPORTS) + ' ' + ('' + parsedEnv.HOT_RELOAD) + ' ' + ('' + parsedEnv.LEGACY_LODASH) + ' ' + parsedEnv.BROWERS
            }
        });
    }

    babelLoaders.push({
        loader: 'babel-loader',
        options: {
            cacheDirectory: false,
            presets: ['babel-preset-updated']
        }
    });

    config.addComplexLoader(20, {
        test: /\.(js|jsx)$/,
        use: babelLoaders,
        exclude: { and: [/node_modules/, { not: [/focus-components-updated/, /focus-core-updated/] }] // FIXME for now, change /focus-*/ to /focus-components/
        } });

    // Ignoring devtools if not DEV
    if (!parsedEnv.DEV) {
        config.addSimpleLoader(25, /focus-devtools-updated/, 'null-loader');
    }

    // Loader pour le SASS (Extraction du fichier JS, vers un fichier CSS indépendant, cf plugin)
    config.addComplexLoader(30, (0, _cssLoaderBuilder2.default)(parsedEnv));

    // Loader pour les fonts
    config.addComplexLoader(50, function (env) {
        return {
            test: /\.(ttf|eot|woff|woff2|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: env.ASSET_LIMIT,
                name: 'fonts/[name]_[sha512:hash:base64:7].[ext]'
            }
        };
    });

    // Loader pour les images
    config.addComplexLoader(55, function (env) {
        return {
            test: /\.(png|jpg|jpeg|gif)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: env.ASSET_LIMIT,
                name: 'img/[name]_[sha512:hash:base64:7].[ext]'
            }
        };
    });
    return config;
};

exports.default = baseConfig;
module.exports = exports.default;