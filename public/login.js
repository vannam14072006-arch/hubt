function register(){


let user =
document.getElementById("username").value;


let pass =
document.getElementById("password").value;



fetch("/register",{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({

username:user,

password:pass

})


})



.then(res=>res.json())


.then(data=>{


document.getElementById("msg").innerHTML =
data.msg || "Đã gửi";


})


.catch(err=>{


console.log(err);


});



}







function login(){


let user =
document.getElementById("username").value;


let pass =
document.getElementById("password").value;



fetch("/login",{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({

username:user,

password:pass

})


})



.then(res=>res.json())


.then(data=>{


if(data.token){


localStorage.setItem(
"token",
data.token
);



localStorage.setItem(
"username",
data.username
);



window.location="chat.html";


}

else{


document.getElementById("msg").innerHTML =
data.error;


}



});



}