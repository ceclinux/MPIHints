//获取img的真实尺度来计算显示的长度
//这不是数组啊亲
//必须是window.load因为必须等图片先加载出来才能得到Image().width
$(window).load(function(){var screenImage = $(".postimage");
               var defaultWidth = 700;
               // Create new offscreen image to test
               for(var i=0;i<screenImage.length;i++){
                   var theImage = new Image();
                   theImage.src = screenImage.eq(i).attr("src");
                   if(theImage.width<defaultWidth){
                       screenImage.eq(i).attr('width',theImage.width);
                   }
                   else
                       screenImage.eq(i).attr('width',defaultWidth);
                   screenImage.eq(i).css('display','block').css('visibility','visible');
               }

})
