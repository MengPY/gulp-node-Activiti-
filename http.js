var http = require('http')
var fs = require('fs')
// var multiparty = require('multiparty');
var server = http.createServer()

const https = require('https');

let reqUrl = 'https://www.liepin.com/zhaopin/?init=-1&headckid=0417b67c8d823dcb&fromSearchBtn=2&sfrom=click-pc_homepage-centre_searchbox-search_new&ckid=0417b67c8d823dcb&degradeFlag=0&key=%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91&siTag=D_7XS8J-xxxQY6y2bMqEWQ%7EfA9rXquZc5IkJpXC-Ycixw&d_sfrom=search_fp&d_ckId=466b672969a37b2deaf20975f4b05e7c&d_curPage=0&d_pageSize=40&d_headId=466b672969a37b2deaf20975f4b05e7c&curPage=1';



server.on('request', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // 设置可访问的源
  res.setHeader("Access-Control-Allow-Headers", "x-prototype-version, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Expose-Headers", "X-JSON")

  //允许访问的方式
  res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  // res.setHeader("content-type", "application/json")
  var url = req.url
  // console.log(url)
  var viewModelId = url.substr(-4) == 'json' && url.split('model/')[1].split('/json')[0];
  var saveModelId = url.substr(-4) == 'save' && url.split('model/')[1].split('/save')[0];
  // console.log(modelId)
  // console.log(url)
  if (url === '/') {	 
    var response = res;
    https.get(reqUrl, function (res) {
      let chunks = [],
          size = 0;
      res.on('data', function (chunk) {
          chunks.push(chunk);
          size += chunk.length;
      });

      res.on('end', function () {
          // console.log('数据包传输完毕');
          let data = Buffer.concat(chunks, size);
          // console.log(data);
          let html = data.toString();
          response.setHeader('Content-Type', 'text/html; charset=utf-8')
          response.end(html);
      });
    })
  } else if (url === '/writeFile') {
    // fs.readFile('./writeme.txt', function(err, data) {
    //   if (err) throw err;
    //   var readRst = data;
      
    // })
    fs.writeFile('./writeme.json', '我是写入的内容', function (err) {
      // 判断 如果有错 抛出错误 否则 打印写入成功
      if (err) throw err;
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end('写入文件成功!')
   })
    
  } else if (url === '/writeStream') {
    // fs.readFile('./writeme.txt', function(err, data) {
    //   if (err) throw err;
    //   var readRst = data;
      
    // })
	    var json = { name: 'mpy', age: '22' };
		var Stream = fs.createWriteStream('writeme.json', {start: 0});
		Stream.write(JSON.stringify(json, null, 2), 'utf8');
		Stream.end();
		res.setHeader('Content-Type', 'text/html; charset=utf-8')
		res.end('写入文件成功!')
    
  } else if ( url === '/pipe') {
	  
		// 创建一个可读流
		var readerStream = fs.createReadStream('writeme.json');

		// 创建一个可写流
		var writerStream = fs.createWriteStream('output.json');

		// 管道读写操作
		// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
		readerStream.pipe(writerStream);
		res.setHeader('Content-Type', 'text/html; charset=utf-8')
		res.end("程序执行完毕");
  } else if (url === '/delFile') {
    // 删除文件
    fs.unlink('./writeme.json', function (err) {
      // 判断 如果有错 抛出错误 否则 打印删除成功
      if (err) throw err; 
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end('删除成功!')
    })
  }  else if (url === '/plain') {
    // text/plain 就是普通文本
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('hello 世界')
  } else if (url === '/html') {
    // 如果你发送的是 html 格式的字符串，则也要告诉浏览器我给你发送是 text/html 格式的内容
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end('<p>hello html <a href="https://www.baidu.com">百度一下</a></p>')
  } else if (url === '/img') {
    // url：统一资源定位符
    // 一个 url 最终其实是要对应到一个资源的
    fs.readFile('./logo.png', function (err, data) {
      if (err) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end('文件读取失败，请稍后重试！')
      } else {
        // data 默认是二进制数据，可以通过 .toString 转为咱们能识别的字符串
        // res.end() 支持两种数据类型，一种是二进制，一种是字符串
        // 图片就不需要指定编码了，因为我们常说的编码一般指的是：字符编码
	    	// console.log(data)
        res.setHeader('Content-Type', 'image/jpeg')
        res.end(data)
      }
    })
  } else if (url === `/model/${viewModelId}/json`) { //获取流程json配置
    fs.readFile('./model.json', function (err, data) {
      if (err) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end('json文件读取失败，请稍后重试！')
      } else {
        var data = data.toString();
        // console.log(data)
        res.setHeader("content-type", "application/json")
        res.end(data)
      }
    })
  } else if (url === `/model/${saveModelId}/save`) { //保存流程json配置
    // res.setHeader('Content-Type', 'application/json; charset=utf-8')
   res.end(JSON.stringify({ success: true, saveModelId, }))
  } else if (url.split('?')[0] === '/editor/stencilset') {
    fs.readFile('./stencilset.json', function (err, data) {
      if (err) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end('json文件读取失败，请稍后重试！')
      } else {
        var data = data.toString();
        // console.log(data)
        res.setHeader("content-type", "application/json")
        res.end(data)
      }
    })
  } else {
    res.end('404 Not Found.')
  }
})
server.listen(3000, function () {
  console.log('Server is running at localhost:3000; time:'+ new Date())
})