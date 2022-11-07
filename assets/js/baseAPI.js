// 每次调用 $.get() 或 $.post() 或$.ajax() 的时候，
// 都会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$(function () {
    $.ajaxPrefilter((options) => {
        // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
        options.url = 'http://www.liulongbin.top:3007' + options.url
    })
})