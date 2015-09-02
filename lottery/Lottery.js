function Lottery(id,lottery, lotteryType, cover, coverType, width, height, pointRadius, percent, drawPercentCallback) {
    this.conId = id;
    this.conNode = document.getElementById(this.conId);
    this.cover = cover;
    this.coverType = coverType;
    this.background = null;
    this.backCtx = null;
    this.mask = null;
    this.maskCtx = null;
    this.lottery = lottery;
    this.lotteryType = lotteryType||'image';
    this.width = width || 300;
    this.height = height || 100;
    this.clientRect = null;
    this.drawPercentCallback = drawPercentCallback || null;
    this.pointRadius=pointRadius || 40;//笔触半径
    this.percent=percent || 70;//涂抹百分比
    this.posX=0;
    this.posY=0;
    this.maskColBlock=Math.floor(this.width/this.pointRadius);//遮罩层横向被分成的块数
    this.numBlock=this.maskColBlock*(Math.floor(this.height/this.pointRadius));//遮罩层所有的块数
    this.blocksFlag=[];
    this.ratio=0;
    this.complete=false;
    this.init();
}

Lottery.prototype = {
    createElement: function (tagName, attributes) {
        var ele = document.createElement(tagName);
        for (var key in attributes) {
            ele.setAttribute(key, attributes[key]);
        }
        return ele;
    },
    getTransparentPercent: function(ctx, width, height) {
        var imgData = ctx.getImageData(0, 0, width, height),
            pixles = imgData.data,
            transPixs = [];
        for (var i = 0, j = pixles.length; i < j; i += 4) {
            var a = pixles[i + 3];
            if (a < 128) {
                transPixs.push(i);
            }
        }
        return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
    },
    evaluatePoint:function(tx,ty){
        var p = Math.floor(tx/this.pointRadius) + Math.floor( ty / this.pointRadius ) * (this.maskColBlock);
        if ( p >= 0 && p < this.numBlock ) {
            this.ratio += this.blocksFlag[p];
            this.blocksFlag[p] = 0;
            if ( !this.complete) {
                var number=((this.ratio/this.numBlock)*100).toFixed(2);
                if ( this.drawPercentCallback != null ){
                    this.drawPercentCallback.call(null, number);
                }
                if ( number>= this.percent ) {
                    this.complete = true;                
                    this.resizeCanvas(this.mask, 0, 0);
                    this.drawPercentCallback(100);                    
                }
            }
        }
    },
    resizeCanvas: function (canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').clearRect(0, 0, width, height);
    },
    drawPoint: function (x, y) {
        _this=this;
        this.maskCtx.beginPath();
        var radgrad = this.maskCtx.createRadialGradient(x, y, 0, x, y, this.pointRadius);
        radgrad.addColorStop(0, 'rgba(0,0,0,1)');
        radgrad.addColorStop(1, 'rgba(255, 255, 255, 1)');
        this.maskCtx.fillStyle = radgrad;
        this.maskCtx.arc(x, y, this.pointRadius, 0, Math.PI * 2, true);
        this.maskCtx.fill();
        if (this.drawPercentCallback) {
            
            var number=_this.getTransparentPercent(_this.maskCtx, _this.width, _this.height);
            _this.drawPercentCallback.call(null, number);
            if (number>_this.percent) {
                _this.resizeCanvas(_this.mask, _this.width, _this.height);
                _this.drawPercentCallback(100);
            };
            
            
        }
    },
    bindEvent: function () {
        var _this = this;
        var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
        var clickEvtName = device ? 'touchstart' : 'mousedown';
        var moveEvtName = device? 'touchmove': 'mousemove';
        if (!device) {
            var isMouseDown = false;
            document.addEventListener('mouseup', function(e) {
                isMouseDown = false;
            }, false);
        } else {
            document.addEventListener("touchmove", function(e) {
                if (isMouseDown) {
                    e.preventDefault();
                }
            }, false);
            document.addEventListener('touchend', function(e) {
                isMouseDown = false;
            }, false);
        }
        this.mask.addEventListener(clickEvtName, function (e) {
            isMouseDown = true;
            var docEle = document.documentElement;
            if (!_this.clientRect) {
                _this.clientRect = {
                    left: 0,
                    top:0
                };
            }
            var x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft;
            var y = (device ? e.touches[0].clientY : e.clientY) - _this.clientRect.top + docEle.scrollTop - docEle.clientTop;
            _this.posX=x;
            _this.posY=y;
            _this.maskCtx.beginPath();
            _this.maskCtx.moveTo(_this.posX-1,_this.posY);
            _this.maskCtx.lineTo(_this.posX,_this.posY);
            _this.maskCtx.stroke();
            _this.evaluatePoint(_this.posX,_this.posY);
            //var number=_this.getTransparentPercent(_this.maskCtx, _this.width, _this.height);
            //_this.drawPercentCallback.call(null, number);
            //_this.drawPoint(x, y);
        }, false);

        this.mask.addEventListener(moveEvtName, function (e) {
            if (!device && !isMouseDown) {
                return false;
            }
            var docEle = document.documentElement;
            if (!_this.clientRect) {
                _this.clientRect = {
                    left: 0,
                    top:0
                };
            }
            var x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft;
            var y = (device ? e.touches[0].clientY : e.clientY) - _this.clientRect.top + docEle.scrollTop - docEle.clientTop;
            _this.maskCtx.beginPath();
            _this.maskCtx.moveTo(_this.posX,_this.posY);
            _this.posX=x;
            _this.posY=y;
            _this.maskCtx.lineTo(_this.posX,_this.posY);
            _this.maskCtx.stroke();
            _this.evaluatePoint(_this.posX,_this.posY);
            //var number=_this.getTransparentPercent(_this.maskCtx, _this.width, _this.height);
            //_this.drawPercentCallback.call(null, number);
            //_this.drawPoint(x, y);
        }, false);
    },
    drawLottery: function () {
        this.background = this.background || this.createElement('canvas', {
            style: 'position:absolute;left:0;top:0;'
        });
        this.mask = this.mask || this.createElement('canvas', {
            style: 'position:absolute;left:0;top:0;'
        }); 

        if (!this.conNode.innerHTML.replace(/[\w\W]| /g, '')) {
            this.conNode.appendChild(this.background);
            this.conNode.appendChild(this.mask);
            this.clientRect = this.conNode ? this.conNode.getBoundingClientRect() : null;
            this.bindEvent();
        }

        this.backCtx = this.backCtx || this.background.getContext('2d');
        this.maskCtx = this.maskCtx || this.mask.getContext('2d');

        if (this.lotteryType == 'image') {
            var image = new Image(),
                _this = this;
            image.onload = function () {
                // _this.width = this.width;
                // _this.height = this.height;
                _this.resizeCanvas(_this.background, this.width, this.height);
                _this.backCtx.drawImage(this, 0, 0);
                _this.drawMask();
            }
            image.src = this.lottery;
        } else if (this.lotteryType == 'text') {
            this.width = this.width;
            this.height = this.height;
            this.resizeCanvas(this.background, this.width, this.height);
            this.backCtx.save();
            this.backCtx.fillStyle = '#FFF';
            this.backCtx.fillRect(0, 0, this.width, this.height);
            this.backCtx.restore();
            this.backCtx.save();
            var fontSize = 30;
            this.backCtx.font = 'Bold ' + fontSize + 'px Arial';
            this.backCtx.textAlign = 'center';
            this.backCtx.fillStyle = '#F60';
            this.backCtx.fillText(this.lottery, this.width / 2, this.height / 2 + fontSize / 2);
            this.backCtx.restore();
            this.drawMask();
        }
    },
    drawMask: function() {
        this.resizeCanvas(this.mask, this.width, this.height);
        if (this.coverType == 'color') {
            this.maskCtx.fillStyle = this.cover;
            this.maskCtx.fillRect(0, 0, this.width, this.height);            
            this.maskCtx.globalCompositeOperation = 'destination-out';
            this.maskCtx.strokeStyle='rgba(255,0,0,255)';
            this.maskCtx.lineWidth=this.pointRadius;
            this.maskCtx.lineCap="round";
        } else if (this.coverType == 'image'){
            var image = new Image(),
                _this = this;
            image.onload = function () {
                _this.maskCtx.drawImage(this, 0, 0);
                _this.maskCtx.globalCompositeOperation = 'destination-out';
                _this.maskCtx.strokeStyle='rgba(255,0,0,255)';
                _this.maskCtx.lineWidth=_this.pointRadius;
                _this.maskCtx.lineCap="round";
            }
            image.src = this.cover;
        }
    },
    init: function (lottery,lotteryType) {
        this.ratio=0;
        this.complete=false;
        var n=this.numBlock;  
        while(n--){
            this.blocksFlag[n]=1;
        }
        if (lottery && lotteryType) {
            this.lottery = lottery ;
            this.lotteryType = lotteryType||'image';
        };
              
        this.drawLottery();
    }
}
