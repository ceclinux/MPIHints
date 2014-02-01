//设置提示，包括文字框内的和提示条
var setToolTip = function(widgit,tooltip,regex){
    $(widgit).focusin(function(e){
        $(tooltip).css('visibility','visible');
        $(document).keypress(function(event){
            checkText(widgit,regex);
        });
    }).focusout(function(e){
        $(tooltip).css('visibility','hidden');});
};

//检查控件内的文字是否正确
var checkText = function  (widgit,regex) {
    if(regex.test($(widgit).val())){
        //表示输入框内正确，绿色
        $(widgit).css('border-color','#2ecc71');
    }else{
        //表示输入框内错误，红色
        $(widgit).css('border-color','#e74c3c');
    }
};

