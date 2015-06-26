$(function () { 
    var page = 1;//初始化page变量 
    var $pictureShow = $("#slide"); 
    var downwidth = 744;//获取框架内容的宽度，既每次移动的大小 
    var page_number=3;//页面的版面数量
    $("#rBtn").click(function () { 
        clearInterval(timer);
        if (!$pictureShow.is(":animated")) {//判断是否正在执行动画效果 
            if (page == page_number) {//已经到最后一个版面了,如果再向后，必须跳转到第一个版面。 
                $pictureShow.animate({ left: '0px' }, "slow");//通过改变left值，跳转到第一个版面 
                page = 1; 
            }
            else { 
                $pictureShow.animate({ left: '-=' + downwidth }, "slow");//通过改变left值，达到每次换一个版面 
                page++; 
            } 
        } 
        timer=setInterval(function(){
            $("#rBtn").trigger("click");
        },5000);
        return false; 
    }); 
    $("#lBtn").click(function () { 
        clearInterval(timer);
        if (!$pictureShow.is(":animated")) { 
            if (page == 1) {//已经到第一个版面了,如果再向前，必须跳转到最后一个版面 
                $pictureShow.animate({ left: '-=' + downwidth * (page_number - 1) }, "slow");//通过改变left值，跳转到最后一个版面 
                page = page_number; 
            } 
            else { 
                $pictureShow.animate({ left: '+=' + downwidth }, "slow");//通过改变left值，达到每次换一个版面 
                page--; 
            } 
            } 
            timer=setInterval(function(){
                $("#rBtn").trigger("click");
            },5000);
        return false; 
    }); 

    $("#slide").mouseover(function(){
        clearInterval(timer);//鼠标经过，删除计时器
    });

    $("#slide").mouseout(function(){//鼠标移出，设定计时器
        clearInterval(timer);
        timer=setInterval(function(){
            $("#rBtn").trigger("click");
        },5000);
    });

    $('a').bind("focus", function(){
        $(this).blur();//去除超链接点击后的虚框
    });
    var timer=setInterval(function(){
        $("#rBtn").trigger("click");
    },5000);
}); 