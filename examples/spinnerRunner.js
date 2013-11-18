$(document).ready(function() {      
    var data = [];
    var wheel;

    var createWheel = function() {
        wheel = new Spinner("#spinnerContainer", { 
            margins: {top: 40, right: 10, bottom: 10, left: 10}, 
            outerR: 200, 
            h: 450,
            data: data
        });
    };
    
    $("#spin").click(function() {      
        var spinResult = wheel.spin();
        var tyme = spinResult.duration;
        var slice = spinResult.selection;

        document.getElementById("spin").disabled = true;
        
        setTimeout(function() {
            document.getElementById("spin").disabled = false;
            $("#result").html("<span>And the winner is...<strong>" + spinResult.selection.key + "!!!</strong></span>");
        }, tyme);
    });    

    $("#new-todo").keyup(function(event) {
        var value = event.target.value;
        if (event.keyCode === 13 && value !== '') {
            listAdd(value);
            wheel.update(data);     
            event.target.value = "";
        }
    });

    var listAdd = function(value) {
        var li = "<li class='todo'><div class='view'><label>" + value + "</label>" +
                 "<button class='destroy'></button></div>" +
                 "<input class='edit' type='text' value='" + value + "'></li>";
                        
        $("#main").removeClass("hidden");
        $("#todo-list").append(li);
        data.push(value);       
    };
    
    $("#todo-list").on('click', '.destroy', function(event) {
        var item = $(this).siblings('label')[0].innerText;
        var pos = $.inArray(item, data);
        if (pos > -1) {
            data.splice(pos, 1);
        }
        wheel.update(data);
        $(this).parentsUntil(".todo").remove();
    }); 
    
    $("#save-list").click(function() {
        var savedData = data.slice(1).join(",");
        $.post("urlGenerator.php", {"data": savedData }, function(d) {
            window.location.hash = "#!" + d;
        });
    });

    if (window.location.hash) {
        var url = "urlGenerator.php?id=" + window.location.hash.slice(2);
        $.getJSON(url, function(d) {
            var tempData = d[0].data.split(",");
            for (var i = 0; i < tempData.length; i++) {
                listAdd(tempData[i]);
            }
            createWheel();
        }).error(function(d) {
            console.log(d);
        });     
    } else {
        createWheel();
    }
});