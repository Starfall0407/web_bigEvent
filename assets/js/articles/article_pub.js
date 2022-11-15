$(function () {
    const layer = layui.layer
    const form = layui.form

    // 渲染下拉列表
    renderIist()
    // 初始化富文本
    initEditor()


    function renderIist() {
        $.ajax({
            method : 'get',
            url : '/my/article/cates',
            success : function (res) {
                if(res.status !== 0) return layer.msg('获取失败')
                // layer.msg('获取成功')
                let htmlStr = template('tmp-list', res)
                $("[name=cate_id]").html(htmlStr)
                form.render()
            }
        })
    }
     // 1. 初始化图片裁剪器
    let $image = $('#image')
    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择文件按钮
    $(".layui-btn-danger").on('click', function () {
        $("[name=files]").click()
    })

    // 监听 file，获取用户选择的文件
    $("[name=files]").on('change', function (e) {
        console.log(e);
        let files = e.target.files
        if(files.length === 0) return 
        let imgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 默认是 发布
    let state = '发布'
    $(".layui-btn-primary").on('click', function () {
        state = '草稿'
    })

    // 发布按钮
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        // 基于 form 快速创建 FormData 表单
        let FD = new FormData($(this)[0])
        FD.append('state', state)
        // 我们发现 FD里的数据是以键值对的形式存储
        // FD.forEach(function (value, k) {
        //     console.log(k, value);
        // })

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                FD.append('cover_img', blob)
                // 上传数据
                uploadData(FD)
            })
    })

    function uploadData(FD) {
        $.ajax({
            method : 'post',
            url : '/my/article/add',
            data : FD,
            contentType : false,
            processData : false,
            success : function (res) {
                if(res.status !== 0) return layer.msg('发布失败')
                layer.msg('发布成功')
                location.href = '/第四阶段/7.bigEvent/article/article_list.html'

            }
        })
    }
})