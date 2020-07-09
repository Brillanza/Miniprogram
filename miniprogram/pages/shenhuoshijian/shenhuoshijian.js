var util=require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2000-01-01',
    now_date:'',
    dayjin:0,
    now_time:'',
    setInter:'',
    xiaoshi:'',
    fenzhong:'',
    miaozhong:'',
    width:0,
    height:0,
    ok:false
  },
  bindDateChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var DATE=util.formatDate(new Date());
    var TIME=util.formatmiao(new Date());
    this.setData({
      date: e.detail.value,
      now_date:DATE,
      now_time:TIME,
      ok:true
    })
    this.num_data()
    this.startSetInter()
  },
  startSetInter:function(){
    var that=this;
    var times='';
    var hous1='';
    var fen1='';
    var miao1='';
    var i=setInterval(function(){
      for(var k=0;k<2;k++)
      {
        hous1+=that.data.now_time[k];
      }
      for(var k=3;k<5;k++)
      {
        fen1+=that.data.now_time[k];
      }
      var t = new Date();
      var s = t.getSeconds();
      var TIME=util.formatmiao(new Date());
      that.setData({
        now_time:TIME,
        xiaoshi:hous1,
        fenzhong:fen1,
        miaozhong:s
      })
      hous1='';
      fen1='';
      miao1='';
    },1000)
  },
  num_data: function (e) {
    var start_date = new Date(this.data.date.replace(/-/g, "/"));
    var end_date = new Date(this.data.now_date.replace(/-/g, "/"));
    var days = end_date.getTime() - start_date.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    if (day>0) {
      this.setData({
        dayjin: day
      })
    } else {
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var TIME=util.formatmiao(new Date());
    this.setData({
      now_time:TIME
    })
    var that = this
		//获取系统信息
		wx.getSystemInfo({
			//获取系统信息成功，将系统窗口的宽高赋给页面的宽高
			success: function(res) {
        console.log("获取信息系统成功",res)
				that.width = res.windowWidth
				that.height = res.windowHeight
			}
		})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //调用canvasApp函数
		this.canvasClock()
		//对canvasAPP函数循环调用
		this.interval = setInterval(this.canvasClock,1000)
  },
  canvasClock: function(){
		var context = wx.createContext()//创建并返回绘图上下文（获取画笔）
		//设置宽高
		var width = this.width
		var height = this.height
		var R = width/2-55;//设置文字距离时钟中心点距离
		//重置画布函数
		function reSet(){
			context.height = context.height;//每次清除画布，然后变化后的时间补上
            context.translate(width/2, height/2);//设置坐标轴原点
            context.save();//保存中点坐标1
		}
		//绘制中心圆和外面大圆
		function circle(){
			//外面大圆
			context.setLineWidth(2);
            context.beginPath();
            context.arc(0, 0, width/2-30, 0, 2 * Math.PI,true);
            context.closePath();
            context.stroke();
            //中心圆
            context.beginPath();
            context.arc(0, 0, 8, 0, 2 * Math.PI, true);
            context.closePath();
            context.stroke();
		}
		//绘制字体
		function num(){
			// var R = width/2-60;//设置文字距离时钟中心点距离
			context.setFontSize(20)//设置字体样式
            context.textBaseline = "middle";//字体上下居中，绘制时间
            for(var i = 1; i < 13; i++) {
                //利用三角函数计算字体坐标表达式
                var x = R * Math.cos(i * Math.PI / 6 - Math.PI / 2);
                var y = R * Math.sin(i * Math.PI / 6 - Math.PI / 2);
                if(i==11||i==12){//调整数字11和12的位置
                    context.fillText(i, x-12, y+9);
                }else {
                    context.fillText(i, x-6, y+9);
                }
            }
		}
		//绘制小格
		function smallGrid(){
				context.setLineWidth(1);
                context.rotate(-Math.PI/2);//时间从3点开始，倒转90度
                for(var i = 0; i < 60; i++) {
                    context.beginPath();
                    context.rotate(Math.PI / 30);
                    context.moveTo(width/2-30, 0);
                    context.lineTo(width/2-40, 0);
                    context.stroke();
                }
         }
         //绘制大格
         function bigGrid(){
         	context.setLineWidth(5);
            for(var i = 0; i < 12; i++) {
                context.beginPath();
                context.rotate(Math.PI / 6);
                context.moveTo(width/2-30, 0);
                context.lineTo(width/2-45, 0);
                context.stroke();
            }
         }
         //指针运动函数
        function move(){
            var t = new Date();//获取当前时间
            var h = t.getHours();//获取小时
            h = h>12?(h-12):h;//将24小时制转化为12小时制
            var m = t.getMinutes();//获取分针
            var s = t.getSeconds();//获取秒针
            context.save();//再次保存2
            context.setLineWidth(7);
            //旋转角度=30度*（h+m/60+s/3600）
            //分针旋转角度=6度*（m+s/60）
            //秒针旋转角度=6度*s
            context.beginPath();
            //绘制时针
            context.rotate((Math.PI/6)*(h+m/60+s/3600));
            context.moveTo(-20,0);
            context.lineTo(width/4.5-20,0);
            context.stroke();
            context.restore();//恢复到2,（最初未旋转状态）避免旋转叠加
            context.save();//3
            //画分针
            context.setLineWidth(5);
            context.beginPath();
            context.rotate((Math.PI/30)*(m+s/60));
            context.moveTo(-20,0);
            context.lineTo(width/3.5-20,0);
            context.stroke();
            context.restore();//恢复到3，（最初未旋转状态）避免旋转叠加
            context.save();
            //绘制秒针
            context.setLineWidth(2);
            context.beginPath();
            context.rotate((Math.PI/30)*s);
            context.moveTo(-20,0);
            context.lineTo(width/3-20,0);
            context.stroke();
        }
		function drawClock(){
			reSet();
			circle();
			num();
			smallGrid();
			bigGrid();
			move();
		}
		drawClock()//调用运动函数
		// 调用 wx.drawCanvas，通过 canvasId 指定在哪张画布上绘制，通过 actions 指定绘制行为
		wx.drawCanvas({
			canvasId:'myCanvas',
			actions: context.getActions()
		})
	},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    clearInterval(this.interval)
  }
})