/*
https://raw.githack.com/

step1:
http://jinyang888.net/aboutUs#0
step2:
javascript:jQuery.getScript('https://raw.githack.com/Gukw/list/master/list.js');void(0);

*/
var aConfig = [
  [0,1,'万千'], //万千
  [0,2,'万百'], //万百
  [0,3,'万十'], //万十
  [0,4,'万个'], //万个
  [1,2,'千百'], //千百
  [1,3,'千十'], //千十
  [1,4,'千个'], //千个
  [2,3,'百十'], //百十
  [2,4,'百个'], //百个
  [3,4,'十个'] //十个

];
var oKey = {};
var countOk = function(oKey, key){
  if(!oKey[key]){
    oKey[key] = [0,0,0];
  }
  $.each(oKey[key], function(i, n){
    if(isNaN(n)){//非数字
      oKey[key][i] = 1;
    }else{
      oKey[key][i] ++;
    }
    
  });
};
var showCount = function(number,aPosition,bPosition,key){
  var a = number.split('')[aPosition];
  var b = number.split('')[bPosition];
  var nResult = 0;
  countOk(oKey, key);
  var aH = oKey[key];
  if(a > b){
    aH[0] = '<td class="big %border%">龙</td>';
  }
  if(a == b){
    aH[1] = '<td class="equal %border%">和</td>';
  }
  if(a < b){
    aH[2] = '<td class="small %border%">虎</td>';
  }
  var aHtml = [];
  $.each(aH, function(i, s){
    var ss;
    if(isNaN(s)){
      ss = s;
    }else{
      ss = '<td class="%border%">'+s+'</td>';
    }
    var sp = "";
    if(i == 0){
      sp = "leftborder";
    }
    ss = ss.replace(/%border%/g,sp);
    aHtml.push(ss);
  });
  return aHtml.join('');
};
var countTrResult = function(number){
  var aNumber = number.split('');
  var aResult = [];
  $.each(aConfig, function(i, config){
    aResult.push(showCount(number, config[0],config[1],config[2]));
  });
  return aResult.join('');
};
var showTr = function(sLine){
  var number = sLine.split('|')[1];
  var riqi = sLine.split('-')[0];
  var qishu = sLine.split('|')[0].split('-')[1];
  var aTr = [];
  aTr.push('<tr>');
  aTr.push('<td class="riqi">'+riqi+'</td>');
  aTr.push('<td class="qishu">'+qishu+'期</td>');
  aTr.push('<td class="haoma">'+number+'</td>');
  aTr.push(countTrResult(number));
  aTr.push('</tr>');
  return aTr.join('');
};
var showData = function(sData){
  var aLine = sData.split(',');
  aLine.reverse();
  $.each(aLine,function(i, sLine){
    var sTr = showTr(sLine);
    $('#list').append(sTr);
  });
}
var cacheData = "";
var loadData = function(){
  $.get('/yx/u/api/game-lottery/openIssues?id=11&issueCount=50&r='+(new Date().getTime()),function(rs){
    showTime();
    var data = rs.data;
    if(data == cacheData){
      return;
    }
    cacheData = data;
    showContent();
    showTh();
    showData(data);
    $("#list").scrollTop($("#list").prop("scrollHeight"));
  });
};
var formatTime = function(s){
  if(s<10){
    s = '0'+s;
  }
  return s;
};
var showTime = function(){
  var dTime = new Date();
  $("#time").html('最后更新时间：'+dTime.getFullYear()+'-'+(dTime.getMonth()+1) + '-'+dTime.getDate()+' '+formatTime(dTime.getHours())+':'+formatTime(dTime.getMinutes())+':'+formatTime(dTime.getSeconds()));
};
var showTh = function(){
  var aH = [];
  var aType = [];
  $.each(aConfig, function(i, config){
    aType.push('<th colspan="3" class="leftborder">'+config[2]+'</th>');
    aH.push('<th class="leftborder">龙</th><th>和</th><th>虎</th>');
  });
  $('#list_tr').append(aType.join(''));
  $('#list_tr1').append(aH.join(''));
};
var showContent = function(){
  $('#content').html([
      '<table id="list_table">',
      '  <thead>',
      '  <tr id="list_tr">',
      '    <th rowspan="2">日期</th>',
      '    <th rowspan="2">期数</th>',
      '    <th rowspan="2">号码</th>',
      '  </tr>',
      '  </thead>',
      '  <tbody>',
      '  <tr id="list_tr1">',
      '  <th class="riqi"></th>',
      '  <th class="qishu"></th>',
      '  <th class="haoma"></th>',
      '  </tbody>',
      '</table>',
      '<table id="list">',
      '  <tbody>',
      '  </tr>',
      '  </tbody>',
      '</table>'
  ].join(''));
};
var showStyle = function(){
  var link = document.createElement('link'); 
  link.type = 'text/css';
  link.rel = 'stylesheet'; 
  link.href = 'https://raw.githack.com/Gukw/list/master/list.css'; 
  document.getElementsByTagName("head")[0].appendChild(link);
};
$(function(){
  showStyle();
  $('body').removeClass();
  $("body").html('<div id="content"></div><div id="time"></div>');
  showContent();
  showTh();
 // showData(sDemoData); 
  setInterval(function(){
    loadData();
  },5000)
 $("#list").height($(window).height() - 80);

});
