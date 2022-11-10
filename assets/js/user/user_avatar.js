$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 打开图片按钮
    $("#upavatar").on('click', function () {
        $("#file").click()
    })

    $("#file").on('change', function (e) {
        // 获取上传的文件
        let files = e.target.files
        if(files.leng === 0) return layer.msg("请上传图片")
        // 将获取过来的图片转化为新的路径
        let imageURL = URL.createObjectURL(files[0])
        // 重新初始化裁切区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imageURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
        })
        $("#confirmBtn").on('click', function () {
            let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       
            // 将 Canvas 画布上的内容，转化为 base64 格式的字符串A
            $.ajax({
                method : 'post',
                url : '/my/update/avatar',
                data : { avatar : dataURL },
                success : function (res) {
                    if(res.status !== 0)return layer.msg('获取头像失败')
                    window.parent.permissions()
                    layer.msg('更换头像成功')

                }
            })
        })
})