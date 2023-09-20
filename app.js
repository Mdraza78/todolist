const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Todo-db');
const app = express();

const itemsschema=new mongoose.Schema({
  name:String
})

  const Item=mongoose.model("Item",itemsschema);

const item1=new Item({
  name:"Welcome to to-dolist"
})

const item2=new Item({
  name:"Hit the + icon to add items"
})

const item3=new Item({
  name:"Hit the checkbox to delete an item..."
})
const defaultItems=[item1,item2,item3];

const listSchema= new mongoose.Schema({
  name:String
})

const List = mongoose.model("List",listSchema);
//Item.insertMany(defaultItems)
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",async function(req, res) {
  let options={weekday:'long',year:'numeric',month:'long',day:'numeric'}
  let today=new Date();
 let msg= today.toLocaleDateString("en-US", options);
  let foundItems=await Item.find({});
  res.render("list.ejs", {listTitle: msg, newListItems:foundItems});
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const item=new Item({
  name:itemName
  })
  item.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId).then(function(foundItem){ Item.deleteOne({_id: checkedItemId})   })
  res.redirect("/")
})

app.get("/:customListName",async function(req, res){
  const customListName=req.params.customListName;
  List.findOne({customListName})
  const list=new List({
    name: customListName
  });
  list.save();

  let listItem=await List.find({});
 
 
 res.render("list.ejs", {listTitle: customListName, newListItems:listItem})
 res.redirect("/");
});



app.listen(8080, function() {
  console.log("Server started on port 3000");
});
