const mysql=require("mysql2");


const db=mysql.createConnection({

host:"localhost",

user:"root",

password:"123456",

database:"chathub"

});


db.connect(err=>{

if(err)
console.log(err);

else
console.log("MYSQL OK");

});


module.exports=db;