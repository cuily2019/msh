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
server.post('/zhuce',function(req,res){
	var obj=req.body;
	console.log(obj)
	pool.query("SELECT * from foot_user where fname=?",[obj.fname],function(err,result){
		if(err)throw err
		if(result.length!=0){
			res.send("用户名已被占用")
			return
		}else{
			if(!obj.fname){
				res.send("用户名不能为空")
				return;
			}else if(obj.fname.length<6||obj.fname.length>12){
				res.send("用户名用户为6~12位数字和字母组成");
				return;
			}
		
			if(!obj.fpwd){
				res.send("密码不能为空")
				return
			}else if(obj.fpwd.length<6||obj.fpwd.length>12){
			   res.send("密码为6~12位数字和字母组成");
			}
			
			if(obj.fpwd2!=obj.fpwd){
				res.send("两次密码不一致")
				return
			}
		
			if(!obj.phone){
				res.send("手机号码不能为空")
				return
			}else if(obj.phone.length!=11){
				res.send("请输入正确手机号码")
				return
			}
		
			pool.query("INSERT INTO foot_user VALUES(null,?,md5(?),?)",[obj.fname,obj.fpwd,obj.phone],function(err,result){
				if (err)
				{
					throw err
				}
				res.send("注册成功")
			})
		}
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
		console.log(result)
		if (result.length>0){
			res.send(result)
		}
	})
})
//用户登录
server.post("/denglu",function(req,res){
	var obj=req.body;
	console.log(obj)
	pool.query("SELECT fid FROM foot_user where fname=? and fpwd=md5(?)",[obj.fname,obj.fpwd],function(err,result){
		if(err)throw err
		if(result.length==0){
			res.send("用户名或密码错误")
		}else{
			res.send("登陆成功")
		}
	})
})




