/*
https://raw.githack.com/

step1:
http://test.jinyang888.net/static/lottery-trend.html?id=11&w=1&q=50&chs=%E9%87%8D%E5%BA%86%E6%97%B6%E6%97%B6%E5%BD%A9
step2:
javascript:jQuery.getScript('https://raw.githack.com/Gukw/list/master/list2.js');void(0);

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
    aH[0] = '<td class="big">龙</td>';
  }
  if(a == b){
    aH[1] = '<td class="equal">和</td>';
  }
  if(a < b){
    aH[2] = '<td class="small">虎</td>';
  }
  var aHtml = [];
  $.each(aH, function(i, s){
    if(isNaN(s)){
      aHtml.push(s);
    }else{
      aHtml.push('<td>'+s+'</td>');

    }
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
  aTr.push('<td>'+riqi+'</td>');
  aTr.push('<td>'+qishu+'期</td>');
  aTr.push('<td>'+number+'</td>');
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
  $.each(aConfig, function(){
    aH.push('<th>龙</th><th>和</th><th>虎</th>');
  });
  $('#list_tr').append(aH.join(''));
};
var showContent = function(){
  $('#content').html([
      '<table id="list">',
      '  <tr id="list_tr">',
      '    <th>日期</th>',
      '    <th>期数</th>',
      '    <th>号码</th>',
      '  </tr>',
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
//  showData(sDemoData); 
  setInterval(function(){
    loadData();
  },5000)

});
