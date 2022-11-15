$(function () {
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage
    
    // 定一个查询对象
    let q = {
        pagenum : 1, // 页码值,默认第一页
        pagesize : 2,   // 每页显示多少条数据
        cate_id : '',   // 文章分类的 Id
        state : '', // 文章的状态，可选值有：已发布、草稿
    }

    // 加载列表区
    loadlist()
    function loadlist() {
        $.ajax({
            method : 'get',
            url : '/my/article/list',
            data : q,
            success : function (res) {
                if(res.status !== 0) return layer.msg('获取数据失败')
                // layer.msg('成功')
                // 渲染表单
                let htmlStr = template('tmp-list', res)
                $("tbody").html(htmlStr)
                // 渲染筛选区
                initcate()
                // 渲染分页区
                renderPage(res.total)

            }
        })
    }

    // 时间过滤器
    template.defaults.imports.dataFormat = function (data) {
        let time = new Date(data)

        const y = time.getFullYear()
        const M = Zero(time.getMonth() + 1)
        const D = Zero(time.getDate())

        const h = Zero(time.getHours())
        const m = Zero(time.getMinutes())
        const s = Zero(time.getSeconds())
        return y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
    }
    // 补零函数
    function Zero(n) {
        return n > 10? n : '0' + n
    }

    // 初始化筛选区
    function initcate() {
        $.ajax({
            method : 'get',
            url : '/my/article/cates',
            success : function (res) {
                if(res.status !== 0) return layer.msg('获取列表信息失败')
                // layer.msg("获取成功")
                // 加载数据
                let htmlStr = template('tmp-sift', res)
                // console.log(htmlStr);
                // 我们发现获取已经获取到了，但是没有更行
                // 因为一开始 layui的js已经加载完毕，那时还没有数据
                // 所以通过 重新加载 layui 的 js，来渲染新数据
                $("[name=cate_id]").html(htmlStr)
                // 通过layui 重新渲染 表单结构
                form.render()
            }
        })

    }

    // 筛选功能
    $(".layui-form").on('submit', function (e) {
        e.preventDefault()
        let cate_id = $('[name=cate_id]').val()
        let state = $("[name=state]").val()
        // 为查询对象添加条件
        q.cate_id = cate_id
        q.state = state
        // 重新渲染表格
        loadlist()
    })

    // 分页区
    function renderPage(total) {
        laypage.render({
            elem : 'page',  // 注意 id 前不用写#
            count : total,  //  数据中属
            limit : q.pagesize, //  每页显示的条数,尽量是动态,不要写死
            curr : q.pagenum,  //  默认被选中哪页数据
            limits : [2, 5, 10],
            layout : ['count', 'limit' ,'prev', 'page', 'next', 'skip'],    // 自定义标签
            
            // 触发 jump 的回调有俩种
            // 1.调用 laypage.render()方法时会触发
            // 2.点击页面切换也会触发
            jump : function (obj, first) {
                // obj 当前分页的所有选项值
                // first ：laypage.render() 触发时 为turue
                //          页面切换时 为 undefined

                // 让q.pagenum 得到要去的页面
                q.pagenum = obj.curr
                //	obj.limit 获取到最新的分页 
                q.pagesize = obj.limit

                // q.pagesize = obj.
                // 更新表格数据，跳转到被选中的页面
                // 根据 first 值不同，从而防止死循环
                if(!first) loadlist()
            }
        })
    }

    // 删除按钮
    $("tbody").on('click', ".layui-btn-danger", function () {
            let id = $(this).attr('data-id')
            let length = $(".layui-btn-danger").length
            layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method : 'get',
                url : '/my/article/delete/' + id,
                success : function (res) {
                    if (res.status !== 0) return layer.msg('删除失败')
                    layer.msg('删除成功')
                    // 我们发现一个小bug，当删完最后一页的数据时，分页会跳到
                    // 前一页，但是表单数据还停留在最后一页
                    // 所以当我们删完最后一页的数据时，让默认页码 -1 
                    // 因为每一条数据都对应的一个删除按钮，所以我们判断删除的个数
                    // 就可以知道是不是这页数据的最后一条
                    if(length === 1) {
                        //  如果只有一个删除按钮，说明删除完以后就没数据了，所以让q.pagenum -1 
                        // 这时由最后一页的数据，变成了前一页的数据，然后重新渲染
                        q.pagenum = q.pagenum <= 1?  q.pagenum : q.pagenum - 1  // 页码值最小为 1
                    }  
                    loadlist()
                }
            })
            layer.close(index);
          })
    })



    function renderIist() {
        $.ajax({
            method : 'get',
            url : '/my/article/cates',
            success : function (res) {
                if(res.status !== 0) return layer.msg('获取失败')
                let htmlStr = template('tmp-sift2', res)
                $("#contentList").html(htmlStr)
                form.render()
            }
        })
    }

    

    // 编辑按
    let index = null
    $("tbody").on('click', '#setBtn', function () {
        let id = $(this).attr('data-id')
        $.ajax({
            method : 'get',
            url : '/my/article/' + id,
            success : function (res) {
                if(res.status !== 0) return layer.msg('获取信息失败')
                // 渲染下拉列表
                renderIist()
                let content1 = template('temp-set', res.data)
                index = layer.open({
                    area: ['1200px', '550px'],
                    type : 1,
                    title : '',
                    content : content1
                })
    
    // 初始化富文本
    initEditor()

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
        let files = e.target.files
        if(files.length === 0) return 
        let imgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 发布按钮
    $('#temp-set').on('submit', '#layui-form', function (e) {
        e.preventDefault()
        // 基于 form 快速创建 FormData 表单
        let FD = new FormData($(this)[0])
        FD.append('state', '发布')
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
            url : '/my/article/edit',
            data : FD,
            contentType : false,
            processData : false,
            success : function (res) {
                if(res.status !== 0) return layer.msg('修改失败')
                layer.msg('修改成功')
                location.href = '/第四阶段/7.bigEvent/article/article_list.html'
                console.log($("#layui-form select").val());
            }
        })
    }
}
        })
})
    
})

    