
//blob类型转换存储
var blobObj={
    /**
     * btoa()：字符串或二进制值转为Base64编码
     * atob()：Base64编码转为原来的编码
     */
    setBlob:function(blob,callback){  //接收Blob和操作base64的字符串
        var reader = new window.FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
            callback(reader.result);
        };
    },
    getBlob:function(dataurl,callback) {  //接收base64字符
        var obj = dataurl.split(','), mime = obj[0].match(/:(.*?);/)[1], //获取类型
            bstr = atob(obj[1]);
        var n = bstr.length, arr = new Array(n);
        while (n--) {
            arr[n] = bstr.charCodeAt(n);
        }
        var u8arr=new Uint8Array(arr);
        var newblob=new Blob([u8arr], { type: mime });
        var url=URL.createObjectURL(newblob);
        var xhr;
        if(window.XMLHttpRequest){
            xhr = new XMLHttpRequest();
        }else{//对IE7及以下版本浏览器做兼容
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.open("GET",url,true);
        xhr.responseType = "blob";
        xhr.onload = function() {
            var blob = this.response;
            callback(blob);
        }
        xhr.send(null);
    }
}
// @param {string} img 图片的base64// @param {int} dir exif获取的方向信息// @param
 //此方法为file input元素的change事件
 function change(){
      var file = this.files[0];
      var myimage=new Image();
      myimage.src=URL.createObjectURL(file);
      myimage.onload=function(){
             if (typeof myimage.naturalWidth == "undefined") {
                 // IE 6/7/8
                 var w = myimage.width;
                 var h = myimage.height;
             }
             else {
                 // HTML5 browsers
                 var w = myimage.naturalWidth;
                 var h = myimage.naturalHeight;
             }
             var orientation;
              var resCanvas = document.getElementById('test');
               EXIF.getData(file, function () {
                   orientation = EXIF.getTag(this, 'Orientation');
               });
               var reader = new FileReader();
               reader.onload = function (e) {
                   getImgData(this.result, orientation, function (data) {
                       //这里可以使用校正后的图片data了
                       blobObj.getBlob(data, function (blob) {
                           var mpImg = new MegaPixImage(blob);
                           mpImg.render(resCanvas, {
                               maxWidth: w,
                               maxHeight: h,
                               quality: .2
                           }, function () {
                               blobObj.getBlob(resCanvas.src, function (newblob) {
                                   console.log(newblob);
                               })
                           });
                       });
                   });
               }
               reader.readAsDataURL(file);
         }
}

function getImgData(img,dir,next){
      var image=new Image();
      image.src=img;
      image.onload=function(){
           var degree=0,drawWidth,drawHeight,width,height;  drawWidth=this.naturalWidth;    drawHeight=this.naturalHeight;  //以下改变一下图片大小
           var maxSide = Math.max(drawWidth, drawHeight);
           if (maxSide > 1280) {
               var minSide = Math.min(drawWidth, drawHeight);    minSide = minSide / maxSide * 1280;    maxSide = 1280;
               if (drawWidth > drawHeight) {
                   drawWidth = maxSide;      drawHeight = minSide;
               }
               else {
                       drawWidth = minSide;      drawHeight = maxSide;
                }
            }
           var canvas=document.createElement('canvas');  canvas.width=width=drawWidth;  canvas.height=height=drawHeight;
           var context=canvas.getContext('2d');
          //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
           switch(dir){
               //iphone横屏拍摄，此时home键在左侧
                case 3:      degree=180;      drawWidth=-width;      drawHeight=-height;      break;
                  //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
                case 6:      canvas.width=height;      canvas.height=width;       degree=90;      drawWidth=width;      drawHeight=-height;      break;    //iphone竖屏拍摄，此时home键在上方
                case 8:      canvas.width=height;      canvas.height=width;       degree=270;      drawWidth=-width;      drawHeight=height;      break;
                }
                     //使用canvas旋转校正
                      context.rotate(degree*Math.PI/180);  context.drawImage(this,0,0,drawWidth,drawHeight);
                     //返回校正图片
                      next(canvas.toDataURL("image/jpeg",.2));
            }
    }
