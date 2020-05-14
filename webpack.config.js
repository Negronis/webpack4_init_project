const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
function resolve(dir){ 
   return path.join(__dirname,dir);
}
module.exports = {
   // 入口
   entry:'./src/app.js',
   // 出口
   output:{
      filename:'js/[name].[chunkhash].js',
      path:path.resolve(__dirname,'dist')
   },
   // 热更新服务器
   devServer:{
      contentBase:path.join(__dirname,'dist')
   },
   // 缩小js体积
   optimization:{
      runtimeChunk:{
         name:"manifest"
      },
      splitChunks:{
         cacheGroups:{ 
            commons:{
               name:"commons",
               chunks:"initial",
               minChunks:1
            }
         }
      }
   },
   module:{
      rules:[
         {
            test: /\.css$/i, 
            use:ExtractTextPlugin.extract({
               fallback:"style-loader",
               use:"css-loader",
               publicPath:'../'
            })
         },
         {
            test:/\.(jpg|gif|png)$/,
            use:[
               {
                  loader:"file-loader",
                  options:{
                     name:'[name]_[hash].[ext]',
                     outputPath:'img/'
                  }
               }
            ]
         },
         {
            test:/\.js$/,
            exclude:/(node_modules|bower_components)/,
            use:{
               loader:'babel-loader',
               options:{
                  presets:['@babel/preset-env']
               }
            }
         }
      ]
   },
   plugins:[
      new HtmlWebpackPlugin({ 
         template:"./src/view/index.html",
         inject:true|'body'
      }),
      new CleanWebpackPlugin(),
      // 压缩js文件
      new UglifyJSPlugin({
         test:/\.js($|\?)/i
      }),
      new webpack.HashedModuleIdsPlugin(),
      new ExtractTextPlugin({
         filename:(getPath) =>{
            return getPath('css/[name].css').replace('css/js','css')
         },
         allChunks:true
      })
   ],
   // 设置快捷路径
   resolve:{
      alias:{
         '@':resolve('src')
      }
   }
}