// 每次调用 $.get() 或 $.post() 或$.ajax() 的时候，
// 都会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$(function () {
    $.ajaxPrefilter((options) => {
        // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
        options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        if(options.url.indexOf('/my/') !== -1) {
            options.headers = {
                Authorization : localStorage.getItem("token") || ''
            };
            options.complete = (res) => {
                    // 不能让用户不登陆就进入后台首页
                    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                        // 强制清空 token
                        localStorage.removeItem('token')
                        // 强制跳转到登录页面
                        location.href = '/第四阶段/7.bigEvent/login.html'
                    }
            }        
        }
    })
})