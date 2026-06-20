const socket=io();


let username=
localStorage.getItem("username");


let room="general";



socket.emit(
"online",
username
);



joinRoom(room);






function joinRoom(r){


room=r;


socket.emit(
"join",
room
);



load();


}







function load(){


fetch(
"/messages/"+room
)


.then(r=>r.json())

.then(data=>{


messages.innerHTML="";


data.forEach(show);



});


}








function send(){


let value=text.value;



if(!value)return;



socket.emit(

"send",

{

sender:username,

room,

message:value,

image:null


}

);



text.value="";


}








socket.on(

"receive",

data=>{


show(data);


}

);








function show(data){


let div=document.createElement("div");


if(data.sender==username)

div.className="bubble me";

else

div.className="bubble";



div.innerHTML=

`

<b>${data.sender}</b>

<br>

${data.message}

`;



messages.appendChild(div);



messages.scrollTop=
messages.scrollHeight;



}








socket.on(

"users",

(data)=>{


online.innerHTML="";


data.forEach(u=>{


online.innerHTML+=

`
<p>🟢 ${u}</p>

`;


});


}

);






function logout(){


localStorage.clear();


location="index.html";


}