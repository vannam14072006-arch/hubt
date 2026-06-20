const express=require("express");
const http=require("http");
const socket=require("socket.io");
const cors=require("cors");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const multer=require("multer");

const db=require("./database");


const app=express();

const server=http.createServer(app);

const io=socket(server);


app.use(cors());

app.use(express.json());

app.use(express.static("public"));

app.use("/uploads",
express.static("uploads"));



const SECRET="CHATHUB_SECRET";




// UPLOAD

const storage=multer.diskStorage({

destination:"uploads/",

filename:(req,file,cb)=>{

cb(null,Date.now()+"-"+file.originalname);

}

});


const upload=multer({storage});





// REGISTER

app.post("/register",(req,res)=>{


let {
username,
password

}=req.body;



let hash=bcrypt.hashSync(password,10);



db.query(

"INSERT INTO users(username,password,avatar) VALUES(?,?,?)",

[
username,
hash,
"default.png"
],

err=>{


if(err)

return res.json({
msg:"User tồn tại"
});


res.json({
msg:"OK"
});


});


});




// LOGIN


app.post("/login",(req,res)=>{


let {
username,
password
}=req.body;



db.query(

"SELECT * FROM users WHERE username=?",

[username],

(err,data)=>{


if(!data.length)

return res.json({
error:"Sai user"
});



let user=data[0];


if(!bcrypt.compareSync(password,user.password))

return res.json({
error:"Sai pass"
});



let token=jwt.sign(
{
username
},
SECRET
);



db.query(

"UPDATE users SET online=1 WHERE username=?",

[username]

);



res.json({

token,

username,

avatar:user.avatar

});

});


});






// LOAD MESSAGE


app.get("/messages/:room",

(req,res)=>{


db.query(

"SELECT * FROM messages WHERE room=?",

[req.params.room],

(err,data)=>{

res.json(data);

});


});







// IMAGE


app.post("/upload",

upload.single("image"),

(req,res)=>{


res.json({

url:req.file.filename

});


});







let users=[];





io.on("connection",socket=>{


socket.on("online",name=>{


socket.username=name;


users.push(name);


io.emit(
"users",
users
);


});






socket.on("join",room=>{

socket.join(room);

});





socket.on("send",data=>{


db.query(

`
INSERT INTO messages
(sender,room,message,image)

VALUES(?,?,?,?)

`,

[
data.sender,
data.room,
data.message,
data.image
]


);



io.to(data.room)

.emit(

"receive",

data

);



});





socket.on("disconnect",()=>{


users=
users.filter(
u=>u!=socket.username
);



io.emit(
"users",
users
);



});


});





server.listen(3000,()=>{

console.log(
"http://localhost:3000"
);

});