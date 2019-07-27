//引入核心模块
const express=require("express");
const mysql =require("mysql");
const bodyParser=require("body-parser");
//创建web服务器
var server=express();
//为服务器配置监听端口
server.listen(8080);
//托管静态资源到public目录下
server.use( express.static("public") );
//使用body-parser中间件，将post请求格式化为对象
server.use(bodyParser.urlencoded({
	extended:false
}));
//创建连接池对象
var pool=mysql.createPool({
	host:'127.0.0.1',
	port:'3306',
	user:'root',
	password:'',
	database:'foot',
	connectionLimit:20
});
//添加路由
//1.用户注册
server.get('/zhuce',function(req,res){
	var obj=req.query;
	pool.query("INSERT INTO foot_user SET ?",[obj],function(err,result){
		if (err)
		{
			throw err
		}
		console.log(result)
	})
});
//首页商品
server.get("/product",function(req,res){
	pool.query("SELECT * FROM foot_product",function(err,result){
		if(err){
			throw err
		}
		res.send(result)
	})
})

server.get("/query",function(req,res){
	var $fid=req.query.id
	console.log($fid)
	if(!$fid){
		res.send("请输入uid")
		return
	};
	pool.query("SELECT * FROM foot_product where fid=?",[$fid],function(err,result){
		if(err){
			throw err
		}
		if (result.length>0){
			res.send(result)
		}
	})
})
////用户登录
//server.get("/denglu",function(req,res){
//	var obj=req.query;
//	pool.query("SELECT fid FROM foot_user where fname=?",[],function(req,res){
//
//	})
//})