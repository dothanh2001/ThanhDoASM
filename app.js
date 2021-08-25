const express = require('express');
const app = express()

const {ObjectId,MongoClient} = require('mongodb');
const url = "mongodb+srv://congthanh:shin1102@cluster0.j8cie.mongodb.net/test";

async function getDB() {
    const client = await MongoClient.connect(url);
    const dbo = client.db("ThanhDoDB");
    return dbo;
}
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.post('/add',async(req,res)=>{

       const idInput = req.body.txtID;
       const nameInput = req.body.txtName;
       const priceInput = req.body.txtPrice;
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
    return dbo;
})

app.get('/edit', async (req, res) => {
    const id = req.query.id;

    const s = await getProductById(id);
    res.render("edit", { product: s });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT)
console.log("app is running ", PORT)
