const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const fileUpload = require('express-fileupload');
const app = express();
const port =process.env.PORT|| 5000;
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ez3jy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("jerins-parlour");
      const services = database.collection("services");
      const testimonials = database.collection("Testimonials");
      const bookings = database.collection("MyBooking");
      const CommingSoon = database.collection("CommingSoon");
      const teams = database.collection("Teams");
      


      //service data getting================
      app.get("/services",async(req,res)=>{
          const curser= services.find({});
          const result=await curser.toArray();
          res.send(result)
      })

      //Testimonials data getting================
      app.get("/testimonials",async(req,res)=>{
          const curser= testimonials.find({});
          const result=await curser.toArray();
          res.send(result)
      })

      ///added testimonial/revew item
      app.post("/testimonials",async(req,res)=>{
        const testimonial= req.body;
        const curser= await testimonials.insertOne(testimonial);
        console.log('revews added',curser);
        res.send(curser)
    })

    ///Comming Soon service
        app.get("/commingsoon",async(req,res)=>{
          const curser=CommingSoon.find({});
          const result=await curser.toArray();
          res.send(result)
        })
      ///booking item
      app.post("/book",async(req,res)=>{
          const book= req.body;
          const curser= await bookings.insertOne(book);
          res.send(curser)
      })


      
      //Add a team member
      app.post("/teams",async(req,res)=>{
          const name=req.body.name;
          const profission=req.body.profision;
          const des=req.body.des;
          const pic=req.files.image;
          const imagedata=pic.data;
          const encoded=imagedata.toString('base64');
          const imgbuffer=Buffer.from(encoded,'base64');
          const team={
              name,
              profission,
              des,
              image:imgbuffer
          }
          const result=await teams.insertOne(team);
          console.log("successfull",result);
          res.send(result)
          
      })
      //teams getting
      app.get("/teams",async(req,res)=>{
          const Workteam= teams.find({});
          const curser=await Workteam.toArray();
          res.send(curser)
      })



    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('i am from server')
})

app.listen(port,()=>{
    console.log('server ready to port',port);
})