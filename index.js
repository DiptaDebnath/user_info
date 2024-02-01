const mysql = require("mysql2");
const { faker } = require('@faker-js/faker');
const express = require("express");
const path = require("path");
const methodOverride = require('method-override');
const { request } = require("http");
const { v4: uuidv4 } = require("uuid");

let app = express();
let port = 8080;

//Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));

//server on
app.listen(port, ()=>{
    console.log(`app is running on port ${port}`);
})

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "user",
    password: "saikat@1289",
});

app.get("/" , (req,res)=>{
    q="SELECT COUNT(*) FROM user_info"
    try {
            connection.query(q,(err,result)=>{
                if(err) throw err;
                response = result[0];
                res.render("home.ejs", { response });
                // console.log(result);
              })
        } catch (error) {
            console.log("Somthing wrong on database" + error);
        }
});
app.get("/user" , (req,res)=>{
    q="SELECT * FROM user_info"
    let count = 0;
    try {
            connection.query(q,(err,results)=>{
                if(err) throw err;
                res.render("userinfo.ejs" , { results , count});
                // console.log(result);
              })
        } catch (error) {
            console.log("Somthing wrong on database" + error);
        }
});

app.get("/user/:id/edit" , (req,res)=>{
    let {id} = req.params;
    q=`SELECT * FROM user_info WHERE id = '${id}'`
    try {
            connection.query(q,(err,result)=>{
                if(err) throw err;
                let response = result[0];
                res.render("edit.ejs", { response });
                console.log(response);
              })
        } catch (error) {
            console.log("Somthing wrong on database" + error);
        }
});

app.patch("/user/:id" , (req,res)=>{
    let {id} = req.params;
    let {username: newusername , password : pass} = req.body;``
    q=`SELECT * FROM user_info WHERE id = '${id}'`
    try {
            connection.query(q,(err,result)=>{
                if(err) throw err;
                let response = result[0];
                if(response.password != pass){
                    res.render("back.ejs",{ id });
                }else{
                    q2=`UPDATE user_info SET username = '${newusername}' WHERE id ='${id}' `;
                    try {
                        connection.query(q2,(err,result)=>{
                            if(err) throw err;
                            res.redirect("/user");
                          })
                    } catch (error) {
                        console.log("Somthing wrong on database" + error);
                    }
                    
                }
                // res.render("edit.ejs", { response });
                // console.log(result);
              })
        } catch (error) {
            console.log("Somthing wrong on database" + error);
        }
});

app.get("/user/add" , (req,res)=>{
    res.render("addAcc.ejs");
});

app.post("/user/add/acc" , (req,res)=>{
    let {username , email , password} = req.body
    let id = uuidv4();
    let data = [id,username,email,password];

    let q = `INSERT INTO user_info (id ,username ,email ,password) VALUES (?,?,?,?)`
    try {
        connection.query(q,data,async(err,result)=>{
            if(err) { throw err};
            console.log(result);
      })
  } catch (err) {
    // console.log("Somthing wrong on database" + error);
    res.send(`this Email already exist`);
}
    res.redirect("/");

});

app.get("/user/:id/Delete" , (req,res)=>{
    let { id } = req.params;
    let q = `SELECT * FROM user_info WHERE id='${id}' `;
    try {
        connection.query(q,(err,result)=>{
            if(err) throw err;
            console.log(result);
            let response = result[0];
            res.render("delete.ejs",{ response });
          })
      } catch (error) {
        console.log("Somthing wrong on database" + error);
    }
    
 
});

app.delete("/user/:id/Delete" , (req,res)=>{
    let { id : formID } = req.params;
    let { password : formPass } = req.body;
    let q = `SELECT * FROM user_info WHERE id='${formID}' `;
    try {
        connection.query(q,(err,result)=>{
            if(err) throw err;
            console.log(result);
            let response = result[0];
            console.log(formPass);
            console.log(response.password);

            if(formPass != response.password){
                res.render("back2.ejs",{response});
            }else{
                let q2 = `DELETE FROM user_info WHERE id='${formID}' `;
                 try {
                    connection.query(q2,(err,result)=>{
                    if(err) throw err;
                    res.redirect("/user");
                })
            } catch (error) {
                    console.log("Somthing wrong on database" + error);
                }
            }
          })
      } catch (error) {
        console.log("Somthing wrong on database" + error);
    }
    
 
});





// creating and instering values on data base
// let createRandomUser = () =>  {
//     return [
//     faker.string.uuid(),
//     faker.internet.userName(),
//     faker.internet.email(),
//     faker.internet.password()
//     ];
//   }

//   let data = [];
//   for(i=0 ; i<20 ; i++){
//     data.push(createRandomUser());
//   }

//   q= "INSERT INTO user_info(id ,username ,email ,password) VALUES ?"
// try {
//     connection.query(q,[data],(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//       })
// } catch (error) {
//     console.log("Somthing wrong on database" + error);
// }
  
// connection.end();