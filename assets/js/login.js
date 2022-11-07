$(function () {
    $("#link_reg").on('click', function () {
        $(".reg-box").show()
        $(".login-box").hide()
    })
    $("#link_login").on('click', function() {
        $(".login-box").show()
        $(".reg-box").hide()
    })
    
    // 获取 layui 中的 form 对象  form.varity()自定义校验方法
    const form = layui.form
    // 获取 layui 中 layer 对象     layer.msg()警告框
    const layer = layui.layer

    form.verify({
        // 自定义正则规则
        psw : [/^[\S]{6,9}$/,'密码必须是6到9位'],
        repsw : function (value) {
            let psw = $(".reg-box [name=password]").val()
            if(value !== psw) return '俩次密码不一致'
        }
    })

    // 监听用户注册
    $("#reg_box").on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        let data = {
            username : $(".reg-box [name=username]").val(), 
            password : $(".reg-box [name=password]").val()
        }
        $.post(
            '/api/reguser', data, function (res) {
                if(res.status !== 0) return layer.msg(res.message);
                layer.msg('注册成功,请登录!');
                // 模拟点击"去登陆
                $("#link_login").click()
                // 
            }
        )
    })


    // 监听用户登录
    $("#login_form").on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method : "post",
            url : "/api/login",
            data : $(this).serialize(),
            success :  (res) => {
                if(res.status !== 0) return layer.msg("登陆失败")
                layer.msg("登陆成功")
                // 登录成功后,将 token 保存在 localStorage 里
                localStorage.setItem('token', res.token)
                // 跳转到后台管理首页
                location.href = '/第四阶段/7.bigEvent/index.html'
            }
        })
    })







})