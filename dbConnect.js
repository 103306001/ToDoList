$(document).ready(function(){
    //解決datetimepicker在boostrap4會有icon無法顯示的問題
    $.fn.datetimepicker.Constructor.Default = $.extend({}, $.fn.datetimepicker.Constructor.Default, { icons: { time: 'fas fa-clock', date: 'fas fa-calendar', up: 'fas fa-arrow-up', down: 'fas fa-arrow-down', previous: 'fas fa-chevron-left', next: 'fas fa-chevron-right', today: 'far fa-calendar-check-o', clear: 'far fa-trash', close: 'far fa-times' } });
    $('#datetimepicker').datetimepicker();

    var content = "";
    var db = firebase.firestore();
    db.collection("matters").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // 將取出的資料轉為json格式
            var string = JSON.stringify([doc.id,doc.data()]);
            if(!JSON.parse(string)[1].checked){
                content += "<tr id = '"+JSON.parse(string)[0]+"'class = 'notFin'>";
                content += "<td class='center'><a class='unfinished'><i class='fas fa-exclamation-circle'></i></a></td>";
            }else{
                content += "<tr id = '"+JSON.parse(string)[0]+"'class = 'Fin bg-success'>";
                content += "<td class='center'><a class='checked'><i class='fas fa-calendar-check'></i></a></td>";
            }
            content += "<td class = 'matter'>"+JSON.parse(string)[1].matter+"</td>";
            content += "<td class = 'time'>"+JSON.parse(string)[1].date+"</td>";
            content +="<td class='center'><a class='edit'><i class='far fa-edit'></i></a></td>";
            content +="<td class='center'><a class='delete'><i class='fas fa-trash-alt'></i></a></td>";
            $(".list").html(content);
        });
    });
    //new matter
    $("#confirm").on( "click", function() {
        var matter = $("#matter").val();
        var datetimepicker = $("#datetimepicker").val();
        if(matter.length==0||datetimepicker.length==0){
            Swal.fire(
                '請確認是否有未輸入的空格',
                '',
                'error'
              )
        }else{
            firebase.firestore().collection("matters").doc().set({
                matter: matter,
                date: datetimepicker,
                checked: false
                });
             $("#ModalCenter").modal('hide');
             setTimeout("self.location.reload();",500);
        }

    });
    
    //show matter unfinished
    $("#mattersToDo").on( "click", function() {
        $('tr.Fin').hide();
        $("tr.notFin").show();
    });
    
    //show matter finished
    $("#mattersFinish").on( "click", function() {
        $('tr.Fin').show();
        $("tr.notFin").hide();
    });

    //change status into finish
    $(".list").on( "click", ".unfinished",function() {
        var matterUpdate =  $(this).closest("tr").attr('id');
        firebase.firestore().collection("matters").doc(matterUpdate).update({
            checked: true
        })
        .then(function() {
            Swal.fire({
                title: '已完成',
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: '確認'
              }).then((result) => {
                if (result.value) {
                      setTimeout("self.location.reload();",200); 
                }
              })
        });
    });

    //delete one matter
    $(".list").on("click",".delete", function(){
        var matterDelete = $(this).closest("tr").attr('id');
        firebase.firestore().collection("matters").doc(matterDelete).delete().then(function() {
                Swal.fire({
                    title: '已刪除',
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '確認'
                  }).then((result) => {
                    if (result.value) {
                          setTimeout("self.location.reload();",200); 
                    }
                  })
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    });

    //delete all finished matter
    $("#mattersFinishDel").on("click", function(){  
        var jobskill_query = firebase.firestore().collection('matters').where("checked", "==", true);
        jobskill_query.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
            doc.ref.delete();
            });
        }) .then(function() {
            Swal.fire({
                title: '已刪除所有已完成事項',
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: '確認'
              }).then((result) => {
                if (result.value) {
                      setTimeout("self.location.reload();",200); 
                }
              })
        });
    });

    //change text into input
    $(".list").on("click",".edit", function(){
        var matterChange = $(this).closest("tr").find(".matter").text();
        var timeChange = $(this).closest("tr").find(".time").text();

        $(this).closest("tr").find(".matter").replaceWith(function () {
            return '<td class = "matter"><input type="text" class = "form-control matterModify" value="' + matterChange + '" /></td>';
        });
        $(this).closest("tr").find(".time").replaceWith(function () {
            return '<td class = "matter"><input type="text" class = "form-control timeModify"  value="' + timeChange + '" /></td>';
        });
        $(this).closest("tr").find(".edit").replaceWith(function () {
            return '<button class="modifyConfirm btn btn-primary">確認</button>';
        });
    });

    //confirm change
    $(".list").on("click",".modifyConfirm", function(){ 
        var matterID = $(this).closest("tr").attr('id');
        var matterModify = $(".matterModify").val();
        var timeModify = $(".timeModify").val();
        firebase.firestore().collection("matters").doc(matterID).update({
            matter: matterModify,
            date: timeModify
        })
        .then(function() {
            Swal.fire({
                title: '已完成修改',
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: '確認'
              }).then((result) => {
                if (result.value) {
                      setTimeout("self.location.reload();",200); 
                }
              })
        });
    });
});


