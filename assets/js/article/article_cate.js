$(function () {
    const layer = layui.layer
    const form = layui.form
    // 获取数据
    loadData()
    function loadData() {
        $.ajax({
            method : 'get',
            url : '/my/article/cates',
            success : function (res) {
                if(res.status !== 0) return layer.msg('获取失败')
                const htmlStr = template('tmp', res)
                // console.log(res);
                $("tbody").html(htmlStr)
            }
        })
    }

    let index = null
    $(".layui-card-header [type=button]").on('click', function () {
            index = layer.open({
            type : 1,
            title : '添加文章分类',
            area: ['500px', '250px'],
            content: $("#addlist").html()
        })
    })
    // 因为是动态添加的，所以要通过事件委托来完成
    $("body").on('submit', '#add-form-data', function (e) {
        e.preventDefault()
        // console.log($(this).serialize());
        $.ajax({
            method : 'post',
            url : '/my/article/addcates',
            data : $(this).serialize(),
            success : function (res) {
                // console.log($("#add-form-data").serialize());
                if(res.status !== 0) return layer.msg('添加失败')
                loadData()
                layer.msg('添加成功')
                // 根据索引关闭索引层
                layer.close(index)
            } 
        })
    })
    // 编辑按钮
    // 因为是动态添加的，所以要通过事件委托来完成
    $("tbody").on('click', '#set', function () {
        index = layer.open({
            area: ['500px', '250px'],
            type : 1,
            title : '修改文章分类',
            content : $("#info_set").html()
        })
        let id = $(this).attr('data-Id')
        $.ajax({
            method : 'get',
            url : '/my/article/cates/' + id, //  $(this).attr('data-Id')
            success : function (res) {
                // 渲染数据
               form.val('load', res.data)
            }
        })
    })
    // 确认提交按钮
    $("body").on('submit', '#setContent', function (e) {
        e.preventDefault()
        $.ajax({
            method : 'post',
            url : '/my/article/updatecate',
            data : $(this).serialize(),
            success : function (res) {
                if (res.status !== 0) return layer.msg('修改失败')
                layer.msg('修改成功')
                layer.close(index)
                loadData()
            }
        })

    })

    // 删除按钮
    // 通过事件委托来进行删除操作
    $("tbody").on("click", "#delete", function () {
        let id = $(this).attr('data-Id')
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method : 'get',
                url : '/my/article/deletecate/' + id,
                success : function (res) {
                    console.log(res);
                    if(res.status !== 0) return layer.msg('删除失败')
                    layer.msg('删除成功')
                }
            })
            layer.close(index);
            loadData()

          });
    })


})