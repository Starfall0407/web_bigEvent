$(function () {
    permissions()

    // 点击按钮，退出登录
    $("#outBtn").on('click', function () {
        // 确定是否退出
        layer.confirm('确认退出等？', {icon : 3, title : '提示'}, function (index) {
            // 清空 token
            localStorage.removeItem('token')
            // 跳转到登录页面
            location.href = '/第四阶段/7.bigEvent/login.html'
    
            // 关闭查询框
            layer.close(index)
        })
    })
});


    function permissions () {
        $.ajax({
            method : "get",
            url : "/my/userinfo",
            // 带有权限的访问必须设置请求头
            // headers 就是请求头配置对象
            // headers : {  // 已经在 baseAPI中统一设置请求头了
            //     Authorization : localStorage.getItem("token") || '',
            // },
            success : function (res) {
                if(res.status !== 0) return layer.msg('获取用户信息失败')
                // 验证成功后，渲染用户信息
                renderUserInfo(res.data)
            }
            // complete : function (res) {
            //     // 不能让用户不登陆就进入后台首页
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 强制清空 token
            //         localStorage.removeItem('token')
            //         // 强制跳转到登录页面
            //         location.href = '/第四阶段/7.bigEvent/login.html'
            //     }
            //     console.log(1111);
            // }
        })
    }
    // 渲染用户信息
    function renderUserInfo(userInfo) {
        // 优先使用用的的昵称，没有就用用户名
        let name = userInfo.nickname || userInfo.username
        $("#welcome").text(`欢迎  ${name}`)
        // have user avater use user avater，end use text-avater
        if (userInfo.user_pic !== null) {
            $(".text-avater").hide()
            $(".layui-nav-img")
                            .attr('src', userInfo.user_pic)
                            .show()
        } else {
            // 获取用户名第一个字符并且转换为大写
            let str = name[0].toUpperCase()
            $(".layui-nav-img").hide()
            $(".text-avater")
                        .text(str)
                        .show()
        }
    }

