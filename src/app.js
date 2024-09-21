const express = require('express')

const app = express()

app.get('/',(req,res)=>{
    res.send("hello from the server")
})

app.get('/test',(req,res)=>{
    res.send("hello from the test")
})

app.listen(3000,()=>{
    console.log("server is successfully listening on port 3000")
})