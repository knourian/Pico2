 state = "IDLE";
var state_last = "";
var graph = ['profile', 'live'];
var points = [];
var profiles = [];
var time_mode = 0;
var selected_profile = 0;
var selected_profile_name = 'leadfree';
var temp_scale = "c";
var time_scale_slope = "s";
var time_scale_profile = "s";
var time_scale_long = "Seconds";
var temp_scale_display = "C";
var kwh_rate = 0.26;
var currency_type = "EUR";
var data = [];
var host = "ws://" + window.location.hostname + ":" + window.location.port;
var ws_status = new WebSocket(host + "/status");
var ws_control = new WebSocket(host + "/control");
var ws_config = new WebSocket(host + "/config");
var ws_storage = new WebSocket(host + "/storage");
var channels = null;
///////////////////////
var live_and_checked_place = ["live","checked"];
var universal_checked = [];
var universal_ch1_live = [];
var universal_ch2_live = [];
var universal_ch3_live = [];
var universal_ch4_live = [];
var universal_ch5_live = [];
var universal_ch6_live = [];
var liveaxis_ch1_y = [];
var liveaxis_ch1_x = [];
var liveaxis_ch2_y = [];
var liveaxis_ch2_x = [];
var liveaxis_ch3_y = [];
var liveaxis_ch3_x = [];
var liveaxis_ch4_y = [];
var liveaxis_ch4_x = [];
var liveaxis_ch5_y = [];
var liveaxis_ch5_x = [];
var liveaxis_ch6_y = [];
var liveaxis_ch6_x = [];


var Checkedaxis_x = [];
var Checkedaxis_y = [];
newprofilex = [];
newprofiley = [];
datafornewprofile = [];
dataforeditprofile = [];
newprofilename = null;
var messageprofile;
editprofilex = [];
editprofiley = [];
var selected_profile_foredit = 0;


livechartdata = [];

/////////////////////////////////////nwe json file


function getchannles() {


    //$.getJSON('channel.json', function (data) {


    //    channles = data;

    //    alert();
    //    channels = data;

    //    console.log("getchannels");
    //    console.log(channels);

    //});
}

function spotactivatechannles() {
    $("#livechannles  input").each(function (i, y) {

        $.each(channels.channel, function (i, x) {
            if (y.id == 'channel' + x.id) {
                if ($('#' + y.id).is(':checked')) {
                    x.activated = "true"
                    channels.channel[i] = x;
                    console.log(x.activated);
					console.log('hello');

                } else {
                    x.activated = "false";
                    channels.channel[i ] = x;
                    
                }
            }


        });
    });
    console.log(channels);

    //localStorage.setItem("channels.json", channels)


}


function setprofileforchannle() {
    $("#chlist  select.sendprofileforchannle").each(function () {
        var channletempid = this.id;
        var profileselecttemp = $(this).find(':selected').text();
        console.log(channletempid);
        $.each(channels.channel, function (i, x) {
            if (x.id == channletempid) {
                $.each(messageprofile, function (i, y) {
                    if (y.name == profileselecttemp) {
                        x.profile = y;
                    }
                });
            }
        });
    });
    var put = { "cmd": "SAVE", "channels": channels };
    var put_cmd = JSON.stringify(put);
    ws_storage.send(put_cmd);
    console.log('setprofileforchannle');
    console.log(channels);


    $("#startModal").modal('hide');
}

function fillchannlesselectlists(message) {
    console.log("getfill");
    console.log(message[0]);
    $("#chlist  select.sendprofileforchannle").each(function (i,o) {
        var temlselectlist = $(this);
        $(this).html('');
        var indextemp = i+1;
      
        var channelprofiletemp = null;
        $.each(channels.channel, function (k,x) {
           
            if (x.id == indextemp) {
                channelprofiletemp = x.profile
              
                
            }
        });
       
        $.each(message, function (j) {
            if (channelprofiletemp.name != null) {
             if (message[j].name == channelprofiletemp.name) {
                temlselectlist.append('<option  selected="selected"  value="' + message[j].name + '">' + message[j].name + '</option>');
             }
            else {
                temlselectlist.append('<option    value="' + message[j].name + '">' + message[j].name + '</option>');
            }
            }
       
          

            });
           
        });
   
}

function updatenewprofilegraph() {
    var dataforeditgraph = [];
    newprofiley = [];
    newprofilex = [];
    $(".newprofilegraphdata").each(function () {
        var y = $(this).find('.targettime input').val();

        var x = $(this).find('.targettemp input').val();
       
        newprofiley.push( y);
        newprofilex.push(x);
    });

    var trace = {
        x: newprofilex,
        y: newprofiley,
        type: 'scatter'
    };

    var newprofiledata = [trace];

    var layout = {
        title: 'Adding Names to Line and Scatter Plot'
    };
    datafornewprofile = [];

    for (var i = 0; i < newprofiley.length; i++) {
        var tempdata = [];

        tempdata[0] = newprofilex[i];
        tempdata[1] = newprofiley[i];

        datafornewprofile.push(tempdata);

    }
    Plotly.newPlot('newprofilegraph', newprofiledata);

}

function savenewprofile() {
    updatenewprofilegraph();

    newprofilename = $("#newprofilename").val();
    var profile = { "type": "profile", "data": datafornewprofile, "name": newprofilename }
    var put = { "cmd": "PUT", "profile": profile };
    var put_cmd = JSON.stringify(put);
    ws_storage.send(put_cmd);

    ws_storage.send('GET');
}

function updateeditprofilegraph() {
    var dataforeditgraph = [];
    newprofiley = [];
    newprofilex = [];
    $(".editprofilegraphdata").each(function () {


        var y = $(this).find('.targettime input').val();
        var x = $(this).find('.targettemp input').val();
        newprofiley.push(y);
        newprofilex.push(x);

    });

    var trace = {
        x: newprofilex,
        y: newprofiley,

        type: 'scatter'
    };

    dataforeditprofile = [];
    for (var i = 0; i < newprofiley.length; i++) {
        var tempdata = [];

        tempdata[0] = newprofilex[i];
        tempdata[1] = newprofiley[i];

        dataforeditprofile.push(tempdata);

    }
    var editprofiledata = [trace];

    var layout = {
        title: 'Adding Names to Line and Scatter Plot'
    };

    Plotly.newPlot('editprofilegraph', editprofiledata);


}

function saveeditedprofile() {

    updateeditprofilegraph();


    newprofilename = selected_profile_foredit;
    console.log(newprofilename);
    var profile = { "type": "profile", "data": dataforeditprofile, "name": newprofilename }
    var put = { "cmd": "PUT", "profile": profile };
    var put_cmd = JSON.stringify(put);
    ws_storage.send(put_cmd);
    console.log("newprofilestructer");
    console.log(dataforeditprofile);
    ws_storage.send('GET');


}

function findselectedprofile() {
    var X = [];
    var Y = [];


    $.each(message, function () {


        if ($(this)[0].name == $("#selectprofileforediting").find(':selected').text()) {

            $.each($(this)[0].data, function () {


                X.push($(this)[0]);
                Y.push($(this)[1]);
            });
            selected_profile_foredit = $(this)[0].name;

        }

        var trace = {
            x: X,
            y: Y,

            type: 'scatter'
        };

        var editprofiledata = [trace];

        var layout = {
            title: 'Adding Names to Line and Scatter Plot'
        };

        Plotly.newPlot('editprofilegraph', editprofiledata);


    });


    X = null;
    Y = null;

}

function filleditprofileselectlist() {
    $("#selectprofileforediting").html('');
    var temlselectlist = $("#selectprofileforediting");
    $.each(message, function (j) {

        temlselectlist.append('<option value="' + message[j].name + '">' + message[j].name + '</option>');


    });

}

////////////////////////////////////////////
//if(window.webkitRequestAnimationFrame) window.requestAnimationFrame = window.webkitRequestAnimationFrame;

//graph.profile =
//{
//    label: "Profile",
//    data: [],
//    points: { show: false },
//    color: "#75890c",
//    draggable: false
//};

//graph.live =
//{
//    label: "Live",
//    data: [],
//    points: { show: false },
//    color: "#d8d3c5",
//    draggable: false
//    }; var q = 3;
//    var testx = [];
//var testy = [];
//function assumruning() {

//    testx.push(q+1);
//    testy.push(q +q*1.1);
//    data.pop();
//    var trace1 = {

//        x: testx,
//        y: testy,
//        type: 'scatter',
//       mode: 'lines'
//    };
//    data.push(trace1);
//    Plotly.newPlot('myDiv', data);

//    q = q+10;

//}

//function updateProfile(id)
//{
//    selected_profile = id;
//    selected_profile_name = profiles[id].name;
//    var temp = [];
//    data = [];
//    $.each(profiles[id].data, function (x, i) {

//        var job_seconds =i.d.length === 0 ? 0 : parseInt(i.d[i.d.length - 1][0]);
//    var kwh = (3850*job_seconds/3600/1000).toFixed(2);
//    var cost =  (kwh*kwh_rate).toFixed(2);
//    var job_time = new Date(job_seconds * 1000).toISOString().substr(11, 8);
//    $('#sel_prof').html(profiles[id].name);
//    $('#sel_prof_eta').html(job_time);
//    $('#sel_prof_cost').html(kwh + ' kWh (' + currency_type + ': ' + cost + ')');
//    graph.profile.data = i.d;
//    temp.push(graph.profile.data);
//    console.log("inside each");
//    console.log(graph.profile.data);
//    });
//    var xb = [];
//    var yb = [];

//    $.each(temp, function (x, profiles) {
//        var trace

//        console.log("temp");
//        console.log(temp);
//        $.each(profiles, function (x, dataa) {

//            xb.push(dataa[0]);
//            yb.push(dataa[1]);


//        });
//        trace = { x: xb, y: yb, type: 'scatter', mode:'lines'
//        };
//        console.log("trace");
//        console.log(trace);
//        data.push(trace);
//        xb = [];
//        yb = [];
//        trace = [];


//    });

//    var trace1 = {
//        x: [1 , 2 , 3 , 4],
//        y: [10, 15, 13, 17],
//        type: 'scatter',
//        type: 'lines'
//    };
//    data.push(trace1);
//    Plotly.newPlot('myDiv', data);


//    console.log(data);
//}

//function deleteProfile()
//{
//    var profile = { "type": "profile", "data": "", "name": selected_profile_name };
//    var delete_struct = { "cmd": "DELETE", "profile": profile };

//    var delete_cmd = JSON.stringify(delete_struct);
//    console.log("Delete profile:" + selected_profile_name);

//    ws_storage.send(delete_cmd);

//    ws_storage.send('GET');
//    selected_profile_name = profiles[0].name;

//    state="IDLE";
//    $('#edit').hide();
//    $('#profile_selector').show();
//    $('#btn_controls').show();
//    $('#status').slideDown();
//    $('#profile_table').slideUp();
//    $('#e2').select2('val', 0);
//    graph.profile.points.show = false;
//    graph.profile.draggable = false;
//    graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ], getOptions());
//}


//function updateProgress(percentage)
//{
//    if(state=="RUNNING")
//    {
//        if(percentage > 100) percentage = 100;
//        $('#progressBar').css('width', percentage+'%');
//        if(percentage>5) $('#progressBar').html(parseInt(percentage)+'%');
//    }
//    else
//    {
//        $('#progressBar').css('width', 0+'%');
//        $('#progressBar').html('');
//    }
//}

//function updateProfileTable()
//{
//    var dps = 0;
//    var slope = "";
//    var color = "";

//    var html = '<h3>Profile Points</h3><div class="table-responsive" style="scroll: none"><table class="table table-striped">';
//        html += '<tr><th style="width: 50px">#</th><th>Target Time in ' + time_scale_long+ '</th><th>Target Temperature in °'+temp_scale_display+'</th><th>Slope in &deg;'+temp_scale_display+'/'+time_scale_slope+'</th><th></th></tr>';

//    for(var i=0; i<graph.profile.data.length;i++)
//    {

//        if (i>=1) dps =  ((graph.profile.data[i][1]-graph.profile.data[i-1][1])/(graph.profile.data[i][0]-graph.profile.data[i-1][0]) * 10) / 10;
//        if (dps  > 0) { slope = "up";     color="rgba(206, 5, 5, 1)"; } else
//        if (dps  < 0) { slope = "down";   color="rgba(23, 108, 204, 1)"; dps *= -1; } else
//        if (dps == 0) { slope = "right";  color="grey"; }

//        html += '<tr><td><h4>' + (i+1) + '</h4></td>';
//        html += '<td><input type="text" class="form-control" id="profiletable-0-'+i+'" value="'+ timeProfileFormatter(graph.profile.data[i][0],true) + '" style="width: 60px" /></td>';
//        html += '<td><input type="text" class="form-control" id="profiletable-1-'+i+'" value="'+ graph.profile.data[i][1] + '" style="width: 60px" /></td>';
//        html += '<td><div class="input-group"><span class="glyphicon glyphicon-circle-arrow-' + slope + ' input-group-addon ds-trend" style="background: '+color+'"></span><input type="text" class="form-control ds-input" readonly value="' + formatDPS(dps) + '" style="width: 100px" /></div></td>';
//        html += '<td>&nbsp;</td></tr>';
//    }

//    html += '</table></div>';

//    $('#profile_table').html(html);

//    //Link table to graph
//    $(".form-control").change(function(e)
//        {
//            var id = $(this)[0].id; //e.currentTarget.attributes.id
//            var value = parseInt($(this)[0].value);
//            var fields = id.split("-");
//            var col = parseInt(fields[1]);
//            var row = parseInt(fields[2]);

//            if (graph.profile.data.length > 0) {
//            if (col == 0) {
//                graph.profile.data[row][col] = timeProfileFormatter(value,false);   
//            }
//            else {
//                graph.profile.data[row][col] = value;
//            }

//            graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ], getOptions());
//            }
//            updateProfileTable();

//        });
//}

//function timeProfileFormatter(val, down) {
//    var rval = val
//    switch(time_scale_profile){
//        case "m":
//            if (down) {rval = val / 60;} else {rval = val * 60;}
//            break;
//        case "h":
//            if (down) {rval = val / 3600;} else {rval = val * 3600;} 
//            break;
//    }
//    return Math.round(rval);
//}

//function formatDPS(val) {
//    var tval = val;
//    if (time_scale_slope == "m") {
//        tval = val * 60;    
//    }
//    if (time_scale_slope == "h") {
//        tval = (val * 60) * 60;
//    }
//    return Math.round(tval);
//}

//function hazardTemp(){
//    if (temp_scale == "f") {
//        return (45 * 9 / 5) + 32
//    } 
//    else {
//        return 45
//    }
//}

//function timeTickFormatter(val)
//{
//    if (val < 1800)
//    {
//        return val;
//    }
//    else
//    {
//        var hours = Math.floor(val / (3600));
//        var div_min = val % (3600);
//        var minutes = Math.floor(div_min / 60);

//        if (hours   < 10) {hours   = "0"+hours;}
//        if (minutes < 10) {minutes = "0"+minutes;}

//        return hours+":"+minutes;
//    }
//}
function stoptask() {

    var cmd =
        {
            "cmd": "STOP"
        }


    ws_control.send(JSON.stringify(cmd));
    universal_live = [];
    //Plotly.newPlot('liveChart', []);
}

function runTask() {
    spotactivatechannles();


    ///پاک کردن لایو های قبلی
    var liveaxis_ch1_y = [];
    var liveaxis_ch1_x = [];
    var liveaxis_ch2_y = [];
    var liveaxis_ch2_x = [];
    var liveaxis_ch3_y = [];
    var liveaxis_ch3_x = [];
    var liveaxis_ch4_y = [];
    var liveaxis_ch4_x = [];
    var liveaxis_ch5_y = [];
    var liveaxis_ch5_x = [];
    var liveaxis_ch6_y = [];

    liveaxis_x = [];
    liveaxis_y = [];

    var cmd =
        {
            "cmd": "RUN",
            "profile": channels
        }


    universal_checked = [];
    $.each(channels.channel, function (i, x) {
        Checkedaxis_x = [];
        Checkedaxis_y = [];
        if (x.activated == "true") {
            $.each(x.profile.data, function (j, temp) {


                Checkedaxis_x.push(temp[0]);
                Checkedaxis_y.push(temp[1]);


                //liveaxis_x[0] = 0;
                //liveaxis_y[0] = 0



            });
            var trace = {
                x: Checkedaxis_x,
                y: Checkedaxis_y,

                type: 'scatter'
            };

            universal_checked.push(trace);
        }



    });

    console.log(universal_checked);
for (var i = 0; i < 6; i++) {
    universal_checked.push([]);

}

console.log("checked");
console.log(universal_checked);
var livedata = universal_checked;

var layout = {
    title: 'Adding Names to Line and Scatter Plot'
};

//Plotly.newPlot('liveChart', livedata);

ws_control.send(JSON.stringify(cmd));
}



 






var allchecked=false;

$(document).ready(function () {
$(".selectall_").click(function(){

if(allchecked!=true){
 $('.selectall').each(function(){
        this.checked = true;
    });
    allchecked=true;
}
else  {

$('.selectall').each(function(){
        this.checked = false;
    });
allchecked=false;

}

});
    updatenewprofilegraph();

    //setInterval(function () { assumruning(); }, 3000);


    if (!("WebSocket" in window)) {
        $('#chatLog, input, button, #examples').fadeOut("fast");
        $('<p>Oh no, you need a browser that supports WebSockets. How about <a href="http://www.google.com/chrome">Google Chrome</a>?</p>').appendTo('#container');
    }
    else {

        // Status Socket ////////////////////////////////

        ws_status.onopen = function () {
            console.log("Status Socket has been opened");

            //$.bootstrapGrowl("<span class=\"glyphicon glyphicon-exclamation-sign\"></span> <b>Yay</b><br/>I'm alive",
            //{
            //ele: 'body', // which element to append to
            //type: 'success', // (null, 'info', 'error', 'success')
            //offset: {from: 'top', amount: 250}, // 'top', or 'bottom'
            //align: 'center', // ('left', 'right', or 'center')
            //width: 385, // (integer, or 'auto')
            //delay: 2500,
            //allow_dismiss: true,
            //stackup_spacing: 10 // spacing between consecutively stacked growls.
            //});
        };

        ws_status.onclose = function () {
            $.bootstrapGrowl("<span class=\"glyphicon glyphicon-exclamation-sign\"></span> <b>ERROR 1:</b><br/>Status Websocket not available", {
                ele: 'body', // which element to append to
                type: 'error', // (null, 'info', 'error', 'success')
                offset: { from: 'top', amount: 250 }, // 'top', or 'bottom'
                align: 'center', // ('left', 'right', or 'center')
                width: 385, // (integer, or 'auto')
                delay: 5000,
                allow_dismiss: true,
                stackup_spacing: 10 // spacing between consecutively stacked growls.
            });
        };

        ws_status.onmessage = function (e) {
            x = jQuery.parseJSON(e.data);
            //if (x.type == "backlog")
            //{
            //    if (x.profile)
            //    {
            //        selected_profile_name = x.profile.name;
            //        $.each(profiles,  function(i,v) {
            //            if(v.name == x.profile.name) {
            //                updateProfile(i);
            //                $('#e2').select2('val', i);
            //            }
            //        });
            //    }

            //    $.each(x.log, function(i,v) {
            //        graph.live.data.push([v.runtime, v.temperature]);
            //        graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ] , getOptions());
            //    });
            //}

            //if(state!="EDIT")
            //{
            //    state = x.state;

            //    if (state!=state_last)
            //    {
            //        if(state_last == "RUNNING")
            //        {
            //            $('#target_temp').html('---');
            //            updateProgress(0);
            //            $.bootstrapGrowl("<span class=\"glyphicon glyphicon-exclamation-sign\"></span> <b>Run completed</b>", {
            //            ele: 'body', // which element to append to
            //            type: 'success', // (null, 'info', 'error', 'success')
            //            offset: {from: 'top', amount: 250}, // 'top', or 'bottom'
            //            align: 'center', // ('left', 'right', or 'center')
            //            width: 385, // (integer, or 'auto')
            //            delay: 0,
            //            allow_dismiss: true,
            //            stackup_spacing: 10 // spacing between consecutively stacked growls.
            //            });
            //        }
            //    }

            //    if(state=="RUNNING")
            //    {
            //        $("#nav_start").hide();
            //        $("#nav_stop").show();

            //        graph.live.data.push([x.runtime, x.temperature]);
            //        graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ] , getOptions());

            //        left = parseInt(x.totaltime-x.runtime);
            //        eta = new Date(left * 1000).toISOString().substr(11, 8);

            //        updateProgress(parseFloat(x.runtime)/parseFloat(x.totaltime)*100);
            //        $('#state').html('<span class="glyphicon glyphicon-time" style="font-size: 22px; font-weight: normal"></span><span style="font-family: Digi; font-size: 40px;">' + eta + '</span>');
            //        $('#target_temp').html(parseInt(x.target));


            //    }
            //    else
            //    {
            //        $("#nav_start").show();
            //        $("#nav_stop").hide();
            //        $('#state').html('<p class="ds-text">'+state+'</p>');
            //    }

            //    $('#act_temp').html(parseInt(x.temperature));

            //    if (x.heat > 0.5) { $('#heat').addClass("ds-led-heat-active"); } else { $('#heat').removeClass("ds-led-heat-active"); }
            //    if (x.cool > 0.5) { $('#cool').addClass("ds-led-cool-active"); } else { $('#cool').removeClass("ds-led-cool-active"); }
            //    if (x.air > 0.5) { $('#air').addClass("ds-led-air-active"); } else { $('#air').removeClass("ds-led-air-active"); }
            //    if (x.temperature > hazardTemp()) { $('#hazard').addClass("ds-led-hazard-active"); } else { $('#hazard').removeClass("ds-led-hazard-active"); }
            //    if ((x.door == "OPEN") || (x.door == "UNKNOWN")) { $('#door').addClass("ds-led-door-open"); } else { $('#door').removeClass("ds-led-door-open"); }

            //    state_last = state;

            //}
        };

        // Config Socket /////////////////////////////////

        ws_config.onopen = function () {
            ws_config.send('GET');
        };

        ws_config.onmessage = function (e) {
            //console.log (e.data);
            //x = JSON.parse(e.data);

            //temp_scale = x.temp_scale;
            //time_scale_slope = x.time_scale_slope;
            //time_scale_profile = x.time_scale_profile;
            //kwh_rate = x.kwh_rate;
            //currency_type = x.currency_type;

            //if (temp_scale == "c") {temp_scale_display = "C";} else {temp_scale_display = "F";}


            //$('#act_temp_scale').html('º'+temp_scale_display);
            //$('#target_temp_scale').html('º'+temp_scale_display);

            //switch(time_scale_profile){
            //    case "s":
            //        time_scale_long = "Seconds";
            //        break;
            //    case "m":
            //        time_scale_long = "Minutes";
            //        break;
            //    case "h":
            //        time_scale_long = "Hours";
            //        break;
            //}

        }

        // Control Socket ////////////////////////////////

        ws_control.onopen = function () {

        };

        ws_control.onmessage = function (e) {

            //Data from Simulation
             
          
            console.log(e.data);

            x = jQuery.parseJSON(e.data);


            switch (x.channel) {

                case 1:

                    liveaxis_ch1_x.push(x.runtime);
                    liveaxis_ch1_y.push(x.temperature);

                    var TESTER = document.getElementById('tester');
                    var trace1 = {
                        x: liveaxis_ch1_x,
                        y: liveaxis_ch1_y,
                        type: 'scatter'
                    };
                    var data = [trace1];

                    Plotly.newPlot(TESTER, data, {
                            margin: { t: 0 }
                        });
                    var q=$("#channel_1").text();

                    $("#channel_1").html(Math.round(x.temperature));
                    if(x.heat==1){

                      $(".channel1_led").addClass('led-red');
                      $(".channel1_led").removeClass('led-white');
                    }else {

                     $(".channel1_led").removeClass('led-red');
                     $(".channel1_led").addClass('led-white');

                    }

                   
                    break;

                case 2:
                    liveaxis_ch2_x.push(x.runtime);
                    liveaxis_ch2_y.push(x.temperature);
                    var TESTER = document.getElementById('tester1');
                    var trace1 = {
                        x: liveaxis_ch2_x,
                        y: liveaxis_ch2_y,
                        type: 'scatter'
                    };
                    var data = [trace1];

                    Plotly.newPlot(TESTER,   data  , {
                        margin: { t: 0 }
                    });
                    $("#channel_2").html(Math.round(x.temperature));
 if(x.heat==1){
                       $(".channel2_led").addClass('led-red');
                      $(".channel2_led").removeClass('led-white');
                    }else {

                     $(".channel2_led").removeClass('led-red');
                     $(".channel2_led").addClass('led-white');

                    }
                    break;

                case 3:
                    liveaxis_ch3_x.push(x.runtime);
                    liveaxis_ch3_y.push(x.temperature);
                    var TESTER = document.getElementById('tester2');
                    var trace1 = {
                        x: liveaxis_ch3_x,
                        y: liveaxis_ch3_y,
                        type: 'scatter'
                    };
                    var data = [trace1];

                    Plotly.newPlot(TESTER, data, {
                        margin: { t: 0 }
                    });
                    $("#channel_3").html(Math.round(x.temperature));
                     if(x.heat==1){
                       $(".channel3_led").addClass('led-red');
                      $(".channel3_led").removeClass('led-white');
                    }else {

                     $(".channel3_led").removeClass('led-red');
                     $(".channel3_led").addClass('led-white');

                    }
                    break;


                case 4:
                    liveaxis_ch4_x.push(x.runtime);
                    liveaxis_ch4_y.push(x.temperature);
                    var TESTER = document.getElementById('tester3');
                    var trace1 = {
                        x: liveaxis_ch4_x,
                        y: liveaxis_ch4_y,
                        type: 'scatter'
                    };
                    var data = [trace1];

                    Plotly.newPlot(TESTER, data, {
                        margin: { t: 0 }
                    });
                    $("#channel_4").html(Math.round(x.temperature));
                     if(x.heat==1){
                       $(".channel4_led").addClass('led-red');
                      $(".channel4_led").removeClass('led-white');
                    }else {

                     $(".channel4_led").removeClass('led-red');
                     $(".channel4_led").addClass('led-white');

                    }
                    break;
                case 5:
                    liveaxis_ch5_x.push(x.runtime);
                    liveaxis_ch5_y.push(x.temperature);
                    var TESTER = document.getElementById('tester4');
                    var trace1 = {
                        x: liveaxis_ch5_x,
                        y: liveaxis_ch5_y,
                        type: 'scatter'
                    };
                    var data = [trace1];

                    Plotly.newPlot(TESTER, data, {
                        margin: { t: 0 }
                    });
                     $("#channel_5").html(Math.round(x.temperature));
                     if(x.heat==1){
                    $(".channel5_led").addClass('led-red');
                      $(".channel5_led").removeClass('led-white');
                    }else {

                     $(".channel5_led").removeClass('led-red');
                     $(".channel5_led").addClass('led-white');

                    }
                    break;
                case 6:
                    liveaxis_ch6_x.push(x.runtime);
                    liveaxis_ch6_y.push(x.temperature);
                    var TESTER = document.getElementById('tester5');
                    var trace1 = {
                        x: liveaxis_ch6_x,
                        y: liveaxis_ch6_y,
                        type: 'scatter'
                    };
                    var data = [trace1];

                    Plotly.newPlot(TESTER, data, {
                        margin: { t: 0 }
                    });
                    $("#channel_6").html(Math.round(x.temperature));
                     if(x.heat==1){

                      $(".channel6_led").addClass('led-red');
                      $(".channel6_led").removeClass('led-white');
                    }else {

                     $(".channel6_led").removeClass('led-red');
                     $(".channel6_led").addClass('led-white');

                    }
                    break;
               
                default:
            }

            var trace1 = {
                x: liveaxis_ch1_x,
                y: liveaxis_ch1_y,

                type: 'scatter'
            };

            universal_checked[universal_checked.length - 6] = trace1;
            var trace2 = {
                x: liveaxis_ch2_x,
                y: liveaxis_ch2_y,

                type: 'scatter'
            };

            //universal_checked[universal_checked.length - 5] = trace2;
            //var trace3 = {
            //    x: liveaxis_ch3_x,
            //    y: liveaxis_ch3_y,

            //    type: 'scatter'
            //};
            //universal_checked[universal_checked.length - 4] = trace3;
            //var trace4 = {
            //    x: liveaxis_ch4_x,
            //    y: liveaxis_ch4_y,

            //    type: 'scatter'
            //};
            //universal_checked[universal_checked.length - 3] = trace4;
            //var trace5 = {
            //    x: liveaxis_ch5_x,
            //    y: liveaxis_ch5_y,

            //    type: 'scatter'
            //};
            //universal_checked[universal_checked.length - 2] = trace5;
            //var trace6 = {
            //    x: liveaxis_ch6_x,
            //    y: liveaxis_ch6_y,

            //    type: 'scatter'
            //};
           

            //universal_checked[universal_checked.length - 1] = trace6;

            
          
           
            
            //var livedata =universal_checked;

            //var layout = {
            //    title: 'Adding Names to Line and Scatter Plot'
            //};
         
            //Plotly.newPlot('liveChart', livedata);


            //graph.live.data.push([x.runtime, x.temperature]);
            //graph.plot = $.plot("#graph_container", [ graph.profile, graph.live ] , getOptions());

        }

        // Storage Socket ///////////////////////////////

        ws_storage.onopen = function () {
            ws_storage.send('GETCH');
            ws_storage.send('GET');
        };
        if (ws_storage.readyState !== ws_storage.CONNECTING) {
             ws_storage.send('GETCH');
        ws_storage.send('GET');
        }
       
        ws_storage.onmessage = function (e) {

            console.log(e.data)
            message = jQuery.parseJSON(e.data);
           
            console.log("get profiles");
            console.log(message);

            if (message.hasOwnProperty('channel')) {
       
                channels = message;
                console.log("hello channels");
                    
            }
            if (message.resp) {
                if (message.resp == "FAIL") {
                    if (confirm('Overwrite?')) {
                        message.force = true;
                        console.log("Sending: " + JSON.stringify(message));
                        ws_storage.send(JSON.stringify(message));
                    }
                    else {
                        //do nothing
                    }
                }

                return;
            }
            //if (message.) {

            //}
            if (message != null) {
                if (!message.hasOwnProperty('channel')) {

                    if (message[0].type == 'profile') {
                        console.log(message);
                        messageprofile = message;
                        fillchannlesselectlists(message);
                        filleditprofileselectlist(message);

                    }
                }

            }

            //setprofileforchannle(message);


            ////the message is an array of profiles
            ////FIXME: this should be better, maybe a {"profiles": ...} container?
            //profiles = message;
            ////delete old options in select
            //$('#e2').find('option').remove().end();
            //// check if current selected value is a valid profile name
            //// if not, update with first available profile name
            //var valid_profile_names = profiles.map(function(a) {return a.name;});
            //if (
            //  valid_profile_names.length > 0 && 
            //  $.inArray(selected_profile_name, valid_profile_names) === -1
            //) {
            //  selected_profile = 0;
            //  selected_profile_name = valid_profile_names[0];
            //}            

            //// fill select with new options from websocket
            //for (var i=0; i<profiles.length; i++)
            //{
            //    var profile = profiles[i];
            //    //console.log(profile.name);
            //    $('#e2').append('<option value="'+i+'">'+profile.name+'</option>');

            //    if (profile.name == selected_profile_name)
            //    {
            //        selected_profile = i;
            //        $('#e2').select2('val', i);
            //        updateProfile(i);
            //    }
            //}

        };


        //$("#e2").select2(
        //{
        //    placeholder: "Select Profile",
        //    allowClear: true,
        //    minimumResultsForSearch: -1
        //});


        //$("#e2").on("change", function(e)
        //{
        //    updateProfile(e.val);
        //});

    }

    getchannles();

});

function myCreateFunction() {
    var table = document.getElementById("myTable");
    var row = table.insertRow(0);
    row.setAttribute('class', 'newprofilegraphdata');


    var cell1 = row.insertCell(0);
    cell1.setAttribute('class', 'targettime ');
    var cell2 = row.insertCell(1);
    cell2.setAttribute('class', 'targettemp ');
    var cell3 = row.insertCell(2);
    //cell1.innerHTML = '<p><input type="text" id="defaultKeypad" class=" defaultKeypad form-control  " /></p>';
    //cell2.innerHTML = '<p><input type="text" id="defaultKeypad" class=" defaultKeypad form-control  " /></p>';
    //cell3.innerHTML = '<p><input type="text" readonly="readonly" class=" form-control" /></p>';

    cell1.innerHTML = '<p><input type="text" id="" class="  form-control  " /></p>';
    cell2.innerHTML = '<p><input type="text" id="" class="  form-control  " /></p>';
    cell3.innerHTML = '<p><input type="text" readonly="readonly" class=" form-control" /></p>';
    $(function () {
        $('.defaultKeypad').each(function (index) {

            $(this).keypad();

        });

    });


}

function myDeleteFunction() {
    document.getElementById("myTable").deleteRow(0);
}

function myCreateFunction_edit() {
    var table = document.getElementById("myTable_edit");
    var row = table.insertRow(0);
    row.setAttribute('class', 'editprofilegraphdata');


    var cell1 = row.insertCell(0);
    cell1.setAttribute('class', 'targettime');
    var cell2 = row.insertCell(1);
    cell2.setAttribute('class', 'targettemp');
    var cell3 = row.insertCell(2);
    cell1.innerHTML = '<input type="text" class="form-control " />';
    cell2.innerHTML = '<input type="text" class="form-control " />';
    cell3.innerHTML = '<input type="text" readonly="readonly" class="form-control" />';
}

function myDeleteFunction_edit() {
    document.getElementById("myTable_edit").deleteRow(0);
}

