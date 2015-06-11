window.onload=function(){
    waterfall('main','box');
    window.onscroll=function(){
        var oParent=document.getElementById('main');
        var dataInt={"data":[{"src":"1.jpg"},{"src":"2.jpg"},{"src":"3.jpg"}]};
        if(checkScroll()){
            for (var i = 0; i < dataInt.data.length; i++) {
                var oBox=document.createElement('div');
                oBox.className='box';
                oParent.appendChild(oBox);
                var oPic=document.createElement('div');
                oPic.className='pic';
                oBox.appendChild(oPic);
                var oImg=document.createElement('img');
                oImg.src='image/'+dataInt.data[i].src;
                oPic.appendChild(oImg);
            };
            waterfall('main','box');
        }
       
    };
};
/*
**使所有块定位到固定位置
*/
function waterfall(parent,box){
    var oParent=document.getElementById(parent);
    var oBoxs=getClsName(parent,box);
    var boxW=oBoxs[0].offsetWidth;
    var clientW=document.body.clientWidth || document.documentElement.clientWidth;
    var col=Math.floor(clientW/boxW);
    oParent.style.width=boxW*col+'px';
    var oAry=[];
    for (var i = 0; i < oBoxs.length; i++) {
        if (i<col) {
            oAry.push(oBoxs[i].offsetHeight);
        }
        else{
            var minValue=Math.min.apply(null,oAry);
            var index=minVIndex(minValue,oAry);
            oBoxs[i].style.position='absolute';
            oBoxs[i].style.left=boxW*index+'px';
            oBoxs[i].style.top=minValue+'px';
            oAry[index]+=oBoxs[i].offsetHeight;
        }
    };
}
/*
*获取所有class为clsName的元素
*/
function getClsName(parent,clsName){
    var oParent=document.getElementById(parent);
    var ary=[];
    var tags=oParent.getElementsByTagName('*');
    for (var i = 0; i < tags.length; i++) {
        if(tags[i].className==clsName)
            ary.push(tags[i]);
    };
    return ary;
}
/*
 *获取数组中的最小值的索引
*/
function minVIndex(value,ary){
    for (var i = 0; i < ary.length; i++) {
        if(ary[i]==value)
            return i;
    };
}
/*
**检测是否满足加载数据的条件
*/
function checkScroll(){
    var oBoxs=getClsName('main','box');
    var lastBox=oBoxs[oBoxs.length-1];
    var scrollH=document.body.scrollTop || document.documentElement.scrollTop;
    var clientH=document.body.clientHeight || document.documentElement.clientHeight;
    return (lastBox.offsetTop+Math.floor(lastBox.offsetHeight/2)<scrollH+clientH)?true:false;
}