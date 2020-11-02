const electron = require('electron');
const $ = require('jquery');
const {ipcRenderer} = electron;
const path = require('path'); 
const fs = require('fs'); 
let pathFile = undefined
//titlebar button
$('#minimize').click(function(){
  ipcRenderer.send("minimize");
});

$('#close').click(function(){
  ipcRenderer.send("close");
});

$('#maximize').click(function() {
  ipcRenderer.send("maximize");
});

//zoom button

let defaulttext = 20;
$("#incresfont").click(function() {
  $("#textareacontent").css("fontsize", `${++defaulttext}px`);
});
$("#decresfont").click(function() {
  $("#textareacontent").css("fontsize", `${--defaulttext}px`);
});
//background change 
$("#bgcolor").change(function(){
  $("#textareacontent").css("background-color", $(this).val());
})
$("#txtcolor").change(function(){
  $("#textareacontent").css("color", $(this).val());
})


//save text
$("#save").click(function() {
let text =  $("#textareacontent").val();
ipcRenderer.send("save", text);
});

//open file text
$("#openfile").click(function() {
  ipcRenderer.send("openfile");
  
  });
ipcRenderer.on("openfilecontent", (event, Content)=>{
  pathFile = Content.path;
  $("#textareacontent").html();
  $('#path').text(Content.path);
  $("#textareacontent").html(Content.content);
})

