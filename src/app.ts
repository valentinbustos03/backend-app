import express from 'express';

const app = express();

app.use('/', (req, res ) =>{
  res.send('Te cojo?');
})

app.listen(3000, () =>{
  console.log("Server running")
})