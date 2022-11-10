$(function () {
    // 导入自定义校准模块
    const form = layui.form
    const layer = layui.layer
    // 自定义校准规则
    form.verify({
        psw : [/[\S]{6,12}/, '请设置6~12位的密码'],
        same : value => {
            if(value === $("[name=oldPwd]").val()) return '不能与原密码相同'
        },
        repsw : value => {
            let psw = $(".layui-input").eq(1).val()
            if (value !== psw) return '两次密码不一致'
        }
    })

    // 修改密码
    $(".layui-form").on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method : 'post',
            url : '/my/updatepwd',
            data : $(this).serialize(),
            success : function (res) {
                if(res.status !== 0) return layer.msg('获取数据失败')
                layer.msg('修改密码成功')
                $(".layui-form")[0].reset()
            }
        })
    })







})