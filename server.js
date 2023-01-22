// Create express app
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
var md5 = require("md5")
const path = require("path")
const es6Renderer = require('express-es6-template-engine')
const cons = require('consolidate');
const db = require("./database")

// Server port
const HTTP_PORT = 3000 

//for post http method for ex.this data is sent from a form for example,
//you need to add some extra processing to parse the body of post requests.
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
//view engine setup
// app.engine('html', es6Renderer);
// assign the swig engine to .html files
//app.engine('html', cons.swig);
// set .html as the default extension
//app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
// View engine setup
app.set('view engine', 'ejs');
// Root endpoint
app.get("/", (req, res, next) => {
    // res.json({"message":"API Backend for managing school students."})
    res.render('login');
});
app.get("/login", (req, res, next) => {
    // res.json({"message":"API Backend for managing school students."})
    res.render('login', {});
});
app.post("/submit_login", (req, res) => {
    let user = {
        email : req.body.email,
        password : req.body.password
    }
    console.log(user)
    if((user.email=="mouad@contact.com" && user.password=="mouad2022")||(user.email=="elyousfi@contact.com" && user.password=="elyousfi2022")){
        // console.log("connected")
        res.render('index', {username: user.email});
        return;
    }
    // console.log("error connecting")
    res.render('404', {
        error: 'Error login in!'
    });   
});
// Insert here your API endpoints
app.get('/allproducts',(request, response)=>{
    let query = "select * from products"
    let params = []
    db.all(query, params, (err, rows)=>{
        if(err){
            //response.status(400).json({"error":err.message});
            response.render('404', {error: err.message});
            return;
        }
        console.log(rows)
        response.render('products/listproducts', {
            message:"success",
            data:rows
        });
        /*response.json({
            "message":"success",
            "data":rows
        });*/

    });
    // return response.send('Received a GET HTTP method')
});
app.get('/getproductbyid/:id',(request, response)=>{
    let query = "select * from products where id = ?"
    let params = [request.params.id]
    db.get(query, params, (err, row)=>{
        if(err){
            response.status(400).json({"error":err.message});
            return;
        }
        response.json({
            "message":"success",
            "data":row
        });
    });
});
app.get('/addproducts',(request, response)=>{
    var query ='select * from students'
    var params =[]
    db.get(query, params, (err, rows)=>{
        if(err){
            response.render('404', {error: err.message});
            return;
        }
        response.render('products/addproduct', {
            message:"success",
            students:rows
        });   
    });
});
app.get('/deleteproducts/:id',(request, response)=>{
    var query ='select * from products where id = ?'
    let params = [request.params.id]
    
    db.get(query, params, (err, row)=>{
        if(err){
            response.render('404', {error: err.message});
            return;
        }
        console.log(row)
        response.render('products/deleteproduct', {
            message:"success",
            product:row
        });
    });
});
app.get('/updateproducts/:id',(request, response)=>{
    var query ='select * from products where id = ?'
    let params = [request.params.id]
    
    db.get(query, params, (err, row)=>{
        if(err){
            response.render('404', {error: err.message});
            return;
        }
        response.render('products/updateproduct', {
            message:"success",
            product:row
        });
    });
});
app.post('/postproducts',(request, response)=>{
    var errors=[]
    if (!request.body.label){
        errors.push("No label specified");
    }
    if (!request.body.price){
        errors.push("No price specified");
    }
    if (errors.length){
        response.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        label: request.body.label,
        price: request.body.price,
        studentid : request.body.studentid
    }
    var query ='INSERT INTO products (label, price, studentid) VALUES (?,?,?)'
    var params =[data.label, data.price, data.studentid]
    db.run(query, params, function (err, result) {
        if (err){
            response.status(400).json({"error": err.message})
            return;
        }
        response.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
});
app.post('/updateproduct/:id',(request, response)=>{
    var data = {
        label: request.body.label,
        price: request.body.price,
        studentid : request.body.studentid
    }
    db.run(
        `UPDATE products set 
           label = COALESCE(?,label), 
           price = COALESCE(?,price), 
           studentid = COALESCE(?,studentid) 
           WHERE id = ?`,
        [data.label, data.price, data.studentid, request.params.id],
        function (err, result) {
            if (err){
                response.render('404', {error: err.message});
                return;
            }
            response.redirect("/allproducts")
    }); 
});
app.post('/deleteproduct/:id',(request, response)=>{
    db.run(
        'DELETE FROM products WHERE id = ?',
        request.params.id,
        function (err, result) {
            if (err){
                console.log(err)
                response.render('404', {error: err.message});
                return;
            }
            response.redirect("/allproducts")
    });
})
app.get('/addproduct',(request, response)=>{
    var query ='select * from students'
    let params = []
    
    db.all(query, params, (err, rows)=>{
        if(err){
            response.render('404', {error: err.message});
            return;
        }
        response.render('products/addproduct', {
            message:"success",
            students:rows
        });
    });
});
app.post('/addproducts',(request, response)=>{
    var data = {
        label: request.body.label,
        price: request.body.price,
        studentid : request.body.studentInput
    }
    db.run(
        'INSERT INTO products (label, price, studentId) VALUES (?,?,?)',
        [data.label, data.price, data.studentid],
        function (err, result) {
            if (err){
                response.render('404', {error: err.message});
                return;
            }
            response.redirect("/allproducts")
    }); 
});
app.get('/getproduct',(request, response)=>{
    var query ='select * from products'
    let params = []
    
    db.all(query, params, (err, rows)=>{
        if(err){
            response.render('404', {error: err.message});
            return;
        }
        response.render('products/researchproducts', {
            message:"success",
            products:rows,
            product:{}
        });
    });
});
app.post('/getproduct',(request, response)=>{
    var query ='select * from products where id = ?'
    let params = [request.body.productInput]
    console.log(params)
    //get list of products
    let pdts;
    db.all("select * from products", [], (err, rows)=>{
        if(err){
            response.render('404', {error: err.message});
            return;
        }
        pdts = rows;
        console.log(pdts);
    });
    db.get(query, params, (err, row)=>{
        if(err){
            response.render('404', {error: err.message});
            return;
        }
        console.log(row)
        response.render('products/researchproducts', {
            message:"success",
            products:pdts,
            product:row
        });
    });
});
// Students
app.get('/allstudents',(request, response)=>{
    let query = "select * from students"
    let params = []
    db.all(query, params, (err, rows)=>{
        if(err){
            response.status(400).json({"error":err.message});
            return;
        }
        response.json({
            "message":"success",
            "data":rows
        });
    });
});
app.get('/getstudentsbyid/:id',(request, response)=>{
    let query = "select * from students where id = ?"
    let params = [request.params.id]
    db.get(query, params, (err, row)=>{
        if(err){
            response.status(400).json({"error":err.message});
            return;
        }
        response.json({
            "message":"success",
            "data":row
        });
    });
});
app.post('/addstudents',(request, response)=>{
    var errors=[]
    if (!request.body.password){
        errors.push("No password specified");
    }
    if (!request.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        response.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        name: request.body.name,
        email: request.body.email,
        password : md5(request.body.password)
    }
    var query ='INSERT INTO students (name, email, password) VALUES (?,?,?)'
    var params =[data.name, data.email, data.password]
    db.run(query, params, function (err, result) {
        if (err){
            response.status(400).json({"error": err.message})
            return;
        }
        response.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
});
app.put('/updatestudents',(request, response)=>{
    var data = {
        name: request.body.name,
        email: request.body.email,
        password : request.body.password ? md5(request.body.password) : null
    }
    db.run(
        `UPDATE students set 
           name = COALESCE(?,name), 
           email = COALESCE(?,email), 
           password = COALESCE(?,password) 
           WHERE id = ?`,
        [data.name, data.email, data.password, request.params.id],
        function (err, result) {
            if (err){
                response.status(400).json({"error": err.message})
                return;
            }
            response.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    }); 
});
app.delete('/deletestudents/:id',(request, response)=>{
    db.run(
        'DELETE FROM students WHERE id = ?',
        request.params.id,
        function (err, result) {
            if (err){
                response.render('404', {error: err.message});
                return;
            }
            response.redirect("/allproducts")
    });
})
// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});