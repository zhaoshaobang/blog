/*
**author:zhaoshaobang
*可以设置游戏面板的行数和列数，默认为18*10
*/
function squareAction(rows,cols){
    this.rows=rows||18;//游戏面板行数
    this.cols=cols||10;//游戏面板列数
    this.content=document.getElementById("content");
    this.content.style.width=this.cols*26+"px";
    this.board=null;
    this.activeBlock=null;
    this.tbl=null;
    this.timer=null;
    this.score=0;
    this.status=1;
    this.generateBoard(this.rows,this.cols);//生成面板
};

squareAction.prototype={
    init:function(){
        var _this=this;
        
        this.tbl=document.getElementById("board");//获取生成的面板
        this.board=new Array(this.rows);//初始化面板数据
        for(var i=0;i<this.rows;i++){   
            this.board[i] = new Array(this.cols);    
        }   
        for(var i=0;i<this.rows;i++){    
            for(var j=0; j<this.cols; j++){    
                this.board[i][j] = 0;    
            }    
        }
        this.activeBlock=this.generateBlock();
        this.paint();   
        this.timer=setInterval(function(){
            _this.moveDown();
        },1000);
        document.onkeydown=function(e){
            _this.keyControl(e);
        };
    },

    generateBoard:function(rows,cols){
        var table=document.createElement("table");
        table.setAttribute("cellpadding","0");
        table.setAttribute("cellspacing","0");
        table.setAttribute("border","1");
        table.setAttribute("id","board");
        for (var i = 0; i < rows; i++) {
            var tr=document.createElement("tr");
            for (var j = 0; j < cols; j++) {
                var td=document.createElement("td");
                tr.appendChild(td);           
            };
            table.appendChild(tr);
        };
        this.content.appendChild(table);
    },
    generateBlock:function(){
        var block = new Array(4);    
        //generate a random int number between 0-6;    
        var t = (Math.floor(Math.random()*20)+1)%7;
        var middle=Math.floor(this.cols/2)    
        switch(t){ 
            //石头 
            case 0:{    
                block[0] = {x:0, y:(middle-1)};    
                block[1] = {x:1, y:(middle-1)};    
                block[2] = {x:0, y:(middle)};    
                block[3] = {x:1, y:(middle)};    
                break;    
            }
             //长条形
            case 1:{    
                block[0] = {x:0, y:(middle-2)};    
                block[1] = {x:0, y:(middle-1)};    
                block[2] = {x:0, y:(middle)};    
                block[3] = {x:0, y:(middle+1)};    
                break;    
            } 
            //  右撇子 
            case 2:{    
                block[0] = {x:0, y:(middle)};    
                block[1] = {x:1, y:(middle-1)};    
                block[2] = {x:1, y:(middle)};    
                block[3] = {x:2, y:(middle-1)};    
                break;    
            } 
            // 左撇子  
            case 3:{    
                block[0] = {x:0, y:(middle-1)};    
                block[1] = {x:1, y:(middle-1)};    
                block[2] = {x:1, y:(middle)};    
                block[3] = {x:2, y:(middle)};    
                break;    
            }
            //  左七字  
            case 4:{    
                block[0] = {x:0, y:(middle-1)};    
                block[1] = {x:1, y:(middle-1)};    
                block[2] = {x:1, y:(middle)};    
                block[3] = {x:1, y:(middle+1)};    
                break;    
            } 
            //右七字   
            case 5:{    
                block[0] = {x:0, y:(middle-1)};    
                block[1] = {x:1, y:(middle-1)};    
                block[2] = {x:2, y:(middle-1)};    
                block[3] = {x:2, y:(middle)};    
                break;    
            } 
            //山形   
            case 6:{    
                block[0] = {x:0, y:(middle)};    
                block[1] = {x:1, y:(middle-1)};    
                block[2] = {x:1, y:(middle)};    
                block[3] = {x:1, y:(middle+1)};    
                break;    
            }   
        }  
        return block;  
    },
    erase:function(){
        for(var i=0; i<4; i++){    
            this.tbl.rows[this.activeBlock[i].x].cells[this.activeBlock[i].y].style.backgroundColor="white";    
        } 
    },
    paint:function(){
        for(var i=0; i<4; i++){    
            this.tbl.rows[this.activeBlock[i].x].cells[this.activeBlock[i].y].style.backgroundColor="red";    
        }   
    },
    moveDown:function(){
        //console.log(this);
        if(this.checkBottomBorder()){
            this.erase();
            for(var i=0; i<4; i++){   
              this.activeBlock[i].x = this.activeBlock[i].x + 1;    
            } 
            this.paint();
        }
        else{
            clearInterval(this.timer);
            this.updateBoard();
            var lines=this.deleteLine();
            if(lines!=0){
                if (lines==2) {
                    lines=3;
                }
                else if(lines==3){
                    lines=6;
                }
                else if(lines==4){
                    lines=10;
                }
                this.score=this.score+lines*100;
                this.updateScore();
                this.eraseBoard();
                this.paintBoard();
            }
            this.activeBlock=this.generateBlock();
            if (!this.validateBlock(this.activeBlock)) {
                alert("Game Over!");
                this.status=2;
                return;
            };
            this.paint();
            var _this=this;
            this.timer=setInterval(function(){
                _this.moveDown();
            },1000);
        }
    },            
    checkBottomBorder:function(){
        for(var i=0; i<this.activeBlock.length; i++){    
            if(this.activeBlock[i].x==this.rows-1){    
                return false;    
            }    
            if(!this.isCellValid(this.activeBlock[i].x+1, this.activeBlock[i].y)){    
                return false;    
            }    
        }    
        return true;
    },
    moveLeft:function(){
        if(this.checkLeftBorder()){    
            this.erase();    
            for(var i=0; i<4; i++){    
                this.activeBlock[i].y = this.activeBlock[i].y - 1;    
            }    
            this.paint();    
        } 
    },
    checkLeftBorder:function(){
        for(var i=0; i<this.activeBlock.length; i++){    
            if(this.activeBlock[i].y==0){    
                return false;    
            }    
            if(!this.isCellValid(this.activeBlock[i].x, this.activeBlock[i].y-1)){    
                return false;    
            }    
        }    
        return true;
    },
    moveRight:function(){
        if(this.checkRightBorder()){    
            this.erase();    
            for(var i=0; i<4; i++){    
                this.activeBlock[i].y = this.activeBlock[i].y + 1;    
            }    
            this.paint();    
        }  
    },
    checkRightBorder:function(){
        for(var i=0; i<this.activeBlock.length; i++){    
            if(this.activeBlock[i].y==this.cols-1){    
                return false;    
            }    
            if(!this.isCellValid(this.activeBlock[i].x, this.activeBlock[i].y+1)){    
                return false;    
            }    
        }    
        return true;
    },
    //旋转, 因为旋转之后可能会有方格覆盖已有的方格.   
    //先用一个tmpBlock,把activeBlock的内容都拷贝到tmpBlock,   
    //对tmpBlock尝试旋转, 如果旋转后检测发现没有方格产生冲突,则   
    //把旋转后的tmpBlock的值给activeBlock.  
    rotate:function(){
        var tmpBlock = this.copyBlock(this.activeBlock);   
        //先算四个点的中心点，则这四个点围绕中心旋转90度。  
        var cx = Math.round((tmpBlock[0].x + tmpBlock[1].x + tmpBlock[2].x + tmpBlock[3].x)/4);    
        var cy = Math.round((tmpBlock[0].y + tmpBlock[1].y + tmpBlock[2].y + tmpBlock[3].y)/4);    
        //旋转的主要算法. 可以这样分解来理解。  
        //先假设围绕源点旋转。然后再加上中心点的坐标。 
        // x0= (x - rx0)*cos(a) - (y - ry0)*sin(a) + rx0 ;
        //y0= (x - rx0)*sin(a) + (y - ry0)*cos(a) + ry0 ; 

        for(var i=0; i<4; i++){    
            tmpBlock[i].x = cx+cy-this.activeBlock[i].y;   
            tmpBlock[i].y = cy-cx+this.activeBlock[i].x;   
        }    
        //检查旋转后方格是否合法.   
        for(var i=0; i<4; i++){    
            if(!this.isCellValid(tmpBlock[i].x,tmpBlock[i].y)){   
                return;   
            }   
        }   
        //如果合法, 擦除   
        this.erase();    
        //对activeBlock重新赋值.   
        for(var i=0; i<4; i++){    
            this.activeBlock[i].x = tmpBlock[i].x;    
            this.activeBlock[i].y = tmpBlock[i].y;    
        }   
        //重画.   
        this.paint();    
    },
    isCellValid:function(x,y){
        if(x>(this.rows-1)||x<0||y>(this.cols-1)||y<0){    
            return false;    
        }    
        if(this.board[x][y]==1){    
            return false;    
        }    
        return true; 
    },
    updateBoard:function(){
        for(var i=0; i<4; i++){    
            this.board[this.activeBlock[i].x][this.activeBlock[i].y]=1;    
        }
    },
    updateScore:function(){
        document.getElementById("score").innerHTML="得分： "+this.score;
    },
    deleteLine:function(){
        var lines = 0;   
        for(var i=0; i<this.rows; i++){   
            var j=0;   
            for(; j<this.cols; j++){   
                if(this.board[i][j]==0){   
                    break;   
                }   
            }   
            if(j==this.cols){   
                lines++;   
                if(i!=0){   
                    for(var k=i-1; k>=0; k--){   
                        this.board[k+1] = this.board[k];   
                    }   
                }   
                this.board[0] = this.generateBlankLine();   
            }   
        }   
        return lines; 
    },
    generateBlankLine:function(){
        var line = new Array(this.cols);   
        for(var i=0; i<this.cols; i++){   
            line[i] = 0;   
        }   
        return line;   
    },
    eraseBoard:function(){
        for(var i=0; i<this.rows; i++){   
            for(var j=0; j<this.cols; j++){   
                this.tbl.rows[i].cells[j].style.backgroundColor = "white";   
            }   
        } 
    },
    paintBoard:function(){
        for(var i=0;i<this.rows;i++){   
            for(var j=0; j<this.cols; j++){    
                if(this.board[i][j]==1){   
                    this.tbl.rows[i].cells[j].style.backgroundColor = "red";   
                }   
            }    
        }
    },
    validateBlock:function(block){
        if(!block){  
            return false;  
        }  
        for(var i=0; i<4; i++){   
            if(!this.isCellValid(block[i].x, block[i].y)){  
                return false;   
            }   
        }  
        return true;  
    },
    keyControl:function(e){
        if(this.status!=1){   
            return;   
        }
        var e=e||event;    
        var code = e.keyCode || e.which || e.charCode;    
        switch(code){    
            case 37:{   
                this.moveLeft();   
                break;    
            }    
            case 38:{   
                this.rotate();    
                break;    
            }    
            case 39:{    
                this.moveRight();    
                break;   
            }    
            case 40:{    
                this.moveDown();    
                break;    
            }    
        } 
    },
    copyBlock:function(old){
        var o = new Array(4);  
        for(var i=0; i<4; i++){    
            o[i] = {x:0, y:0};    
        }  
        for(var i=0; i<4; i++){    
            o[i].x = old[i].x;    
            o[i].y = old[i].y;    
        }  
        return o;  
    }
};
