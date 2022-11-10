$(function () {
    getUserIonfo()
    // 导入校验规则
    const form = layui.form
    // 导入警告框
    const layer = layui.layer
    // 自定义校验规则
    form.verify({
        nickname : [/^[\S]{1,6}$/, '用户名的长度为1~6位']
    })

    // 初始化用户信息
    function getUserIonfo() {
        $.ajax({
            method : 'get',
            url : '/my/userinfo',
            success : (res) => {
                if( res.status !== 0) return layer.msg('获取用户信息失败')
                // $(".layui-form-item [name=username]").val(res.data.username)
                // 我们发现如果 填充的表单很多的话，这样比较繁琐
                // 因此我们用 form.val() 自动填充表单
                form.val("userInfo", res.data)
            }
        })
    }


    // 重置按钮
    $("#btn_reset").on('click', e => {
        e.preventDefault()
        getUserIonfo()
    })

    // 修改信息
    $(".layui-form").on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method : 'post',
            url : '/my/userinfo',
            data : $(this).serialize(),
            success : (res) => {
                if(res.status !== 0 ) return layer.msg('获取用户信息失败')
                layer.msg('修改信息成功')
                // 更新数据
                window.parent.permissions()
            }
        })
    })
})