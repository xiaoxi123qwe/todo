//初始化
{
    var mySwiper = new Swiper('.swiper-container',{
        loop:true,
        pagination: {
            el: '.swiper-pagination',
        },
    })
}
{
    var iscroll = new IScroll('.content',{
        mouseWheel: true,
        scrollbars: true,//在iScroll初始化时开启鼠标滚轮支持和滚动条支持
        shrinkScrollbars:"scale",
        fadeScrollbars:true,
        click:true//手机上可以点击
    });
}
//点击新增
{
    //点击添加弹出输入框
    $(".add").click(function () {
        $(".mask").show();
        $(".inputarea").transition({y:0},500);
        $("#text").val("");
        $(".update").hide();
        $(".submit").show();
    });
    //点击关闭收起输入框
    $(".cancel").click(function () {
        // $(".inputarea").transition({translateY:"-62vh"},500);
        $(".mask").hide();
    });
    //提交、添加
    $(".submit").click(function(){
        var val=$("#text").val();
        if(val===""){
            return;
        }
        $("#text").val("");
        var data=getData();
        var time=new Date().getTime();
        data.push({content:val,time,star:false,done:false});
        saveData(data);
        // $(".inputarea").transition({y:"-62vh"}),500,function () {
        //     $(".mask").hide();
        // }
        render();
    });
    //点击未完成项目
    var state="project";
    $(".project").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        state="project";
        render();
    })
    //点击已完成项目
    $(".done").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        state="done";
        render();
    })
    //点击进行数据更新
    $(".update").click(function(){
        var val=$("#text").val();
        if(val===""){return;}
        $("#text").val("");
        var data=getData();
        var index=$(this).data("index");
        data[index].content=val;
        saveData(data);
        // $(".inputarea").transition({y:"-62vh"},500,function () {
        //     $(".mask").hide();
        // });
        render();
    })

    $(".itemlist")
        //未完成项目》》已完成
        .on("click", ".changestate", function () {
            var index=$(this).parent().attr("id");
            var data=getData();
            data[index].done=true;
            saveData(data);
            render();
        })
        //删除
        .on("click", ".del", function () {
            var index=$(this).parent().attr("id");
            var data=getData();
            data.splice(index,1);
            saveData(data);
            render();
        })
        //标记
        .on("click", "span", function () {
            var index=$(this).parent().attr("id");
            var data=getData();
            data[index].star=!data[index].star;
            saveData(data);
            render();
        })
        //点击查看、修改
        .on("click","p",function(){
            var index=$(this).parent().attr("id");
            var data=getData();
            $(".mask").show();
            $(".inputarea").transition({y:0},500);
            $("#text").val(data[index].content);
            $(".submit").hide();
            $(".update").show().data("index",index);
        })

    //数据的处理
    function getData() {
        return localStorage.todo?JSON.parse(localStorage.todo):[];
    };
    function saveData(data) {
        localStorage.todo=JSON.stringify(data);
    }

    function parseTime(time) {
        var date=new Date();
        date.setTime(time);
        var year=date.getFullYear();
        var month=setZero(date.getMonth()+1);
        var day=setZero(date.getDate());
        var hour=setZero(date.getHours());
        var min=setZero(date.getMinutes());
        var sec=setZero(date.getSeconds());
        return year+"/"+month+"/"+day+"<br>"+hour+":"+min+":"+sec;
    };
    function setZero(n) {
        return n<10?"0"+n:n;
    };

    //重绘
    function render() {
        let data=getData();
        let str="";
        data.forEach(function (val,index) {//es5
            if(state==="project"&&val.done===false){
                str+="<li id="+index+"><p>"+val.content
                    +"</p><time>"+parseTime(val.time)+"</time><span class="+
                    (val.star?"active":"")+">※</span><div class='changestate'>完成</div></li>";
            }else if(state==="done"&&val.done===true){
                str+="<li id="+index+"><p>"+val.content
                    +"</p><time>"+parseTime(val.time)+"</time><span class="+
                    (val.star?"active":"")+">※</span><div class='del'>删除</div></li>";
            }
        })
        $(".itemlist").html(str);
        iscroll.refresh();
        addTouchEvent();
    };
    render();
    //显示右侧隐藏部分
    function addTouchEvent(){
        $(".itemlist>li").each(function(index,ele){
            var hammerobj=new Hammer(ele);
            var sx,movex;
            var max=innerWidth/5;
            var statu="start";
            var flag=true;//是否需要执行结束的动画
            hammerobj.on("panstart",function(e){
                sx=e.center.x;
            })
            hammerobj.on("panmove",function(e){
                let cx=e.center.x;
                movex=cx-sx;
                if(movex>0&&statu==="start"){
                    flag=false;
                    return;
                }
                if(movex<0&&statu==="end"){
                    flag=false;
                    return;
                }
                if(Math.abs(movex)>max){
                    flag=false;
                    statu= statu==="start" ? "end":"start";
                    if(statu==="end"){
                        $(ele).css("x",-max);
                    }else{
                        $(ele).css("x",0);
                    }
                    return;
                }
                if(statu==="end"){
                    movex=-max+cx-sx;
                }
                flag=true;
                $(ele).css("x",movex);
            })
            hammerobj.on("panend",function(e){
                if(!flag){return;}
                if(Math.abs(movex)< max/2){
                    $(ele).transition({x:0});
                    statu="start";
                }else{
                    $(ele).transition({x:-max});
                    statu="end";
                }
            })
        })
    }
}