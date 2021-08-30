const express = require('express');
const app = express()

const {ObjectId,MongoClient} = require('mongodb');
const url = "mongodb+srv://congthanh:shin1102@cluster0.j8cie.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//const url = 'mongodb://localhost:27017S'
async function getDB() {
    const client = await MongoClient.connect(url);
    const dbo = client.db("ThanhDoDB");
    return dbo;
}
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.post('/add',async(req,res)=>{
       const nameInput = req.body.txtName;
       const priceInput = req.body.txtPrice;
       if (priceInput %2 != 0){
           res.render("index",{errorMsg:'gia nhap vao phai la so chan'})
           return;
       }
       const newProduct = {Name: nameInput, Price : priceInput}
       const client = await MongoClient.connect(url);
       const dbo = client.db("ThanhDoDB");
       await dbo.collection("products").insertOne(newProduct);
       res.redirect("/");
})

app.get('/delete',async (req,res)=>{
    const id  =req.query.id;
    const client = await MongoClient.connect(url);
    const dbo = client.db("ThanhDoDB");
    await dbo.collection("products").deleteOne({"_id" : ObjectId(id)});
    res.redirect("/");
})
app.get('/',async (req,res)=>{
    const client = await MongoClient.connect(url);
    const dbo = client.db("ThanhDoDB")      
    const allProducts = await dbo.collection("products").find({}).toArray();
    res.render('index',{data:allProducts})
   // return dbo;
})

app.get('/edit', async (req, res) => {
    const idInput = req.query.id;
    const search = await getProductById(idInput);
    res.render('edit', {products: search});
})

app.post('/update', async (req, res) => {
    const id = req.body.id;
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    await updateProductById(id, nameInput,priceInput);
    res.redirect('/');
})

async function getProductById(idInput){
const dbo= await getDB()
return dbo.collection("products").findOne({_id:ObjectId(idInput)})
}
async function updateProductById(id, nameInput, priceInput){
const dbo= await getDB()
dbo.collection("products").updateOne({_id:ObjectId(id)}, {$set: {Name: nameInput, Price: priceInput}})
}

const PORT = process.env.PORT || 5000;
app.listen(PORT)
console.log("app is running ", PORT)
