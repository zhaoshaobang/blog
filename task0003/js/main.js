/*
**获取元素，selectName格式为#id，或者为.ClassName，element是可选参数，默认为document
*/
/*function $(selectName,element){
    var str1=selectName.charAt(0);
    selectName=selectName.substring(1,selectName.length);
    element=element || document;
    if (str1=="#") {
        return element.getElementById(selectName);
    }
    else if (str1==".") {
        if (document.getElementsByClassName) {
            return element.getElementsByClassName(selectName);
        } 
        else{
            var children = element.getElementsByTagName('*');
            var elements = new Array();
            for (var i=0; i<children.length; i++){
                var child = children[i];
                var classNames = child.className.split(' ');
                for (var j=0; j<classNames.length; j++){
                    if (classNames[j] == className){ 
                        elements.push(child);
                        break;
                    }
                }
            } 
            return elements;
        };
    } 
    else{
        return -1;
    };  
}*/

function getElements(className,element){
    if (element.getElementsByClassName) {
        return element.getElementsByClassName(className);
    }
    else{
        var children = element.getElementsByTagName('*');
        var elements = new Array();
        for (var i=0; i<children.length; i++){
            var child = children[i];
            var classNames = child.className.split(' ');
            for (var j=0; j<classNames.length; j++){
                if (classNames[j] == className){ 
                    elements.push(child);
                    break;
                }
            }
        } 
        return elements;
    }
}

function getElementsByClassName(className, element){
    element=element || document;
    var ary=new Array();
    if (element instanceof HTMLCollection || element instanceof Array) {
        for (var i = 0; i < element.length; i++) {
            var current=element[i];
            var elements=getElements(className,current);
            for (var j = 0; j < elements.length; j++) {
                ary.push(elements[i]);
            };
        };
        return ary;
    }
    ary=getElements(className,element);
    return ary;
}

function $(selectName,element){
    var selectNames_ary=selectName.split(' ');
    element=element || document;
    for (var i = 0; i < selectNames_ary.length; i++) {
        var current=selectNames_ary[i];
        var fisrt_letter=current.charAt(0);
        var name=current.substring(1,current.length);
        if (fisrt_letter=='#') {
            element=element.getElementById(name);
        }
        else if (fisrt_letter=='.') {
            element=getElementsByClassName(name,element);
        };
    };
    return element;
}
/*
**任务选项卡
*/
function tabs(){
    var btns=$("#tasks_btns").getElementsByTagName('span');
    var contents=$("#tasks .content");
    for (var i = 0; i < btns.length; i++) {
        btns[i].index=i;
        btns[i].onclick=function(){
            for (var j = 0; j < btns.length; j++) {
                btns[j].className="btn_filter";
                contents[j].className="content";
            }
            this.className+=" btn_active";
            contents[this.index].className+=" tasks_active";
        };
    };
}

window.onload=function(){
    tabs();
};
