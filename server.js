const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

const exjwt = require('express-jwt');

const bodyParser = require('body-parser');

const path = require('path');

app.use((req,res,next)=> {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Header', 'Content-type,Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


const PORT = 3000;

const secretKey = "My super secret key";

const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

let users = [
    {
        id:1,
        username:'karan',
        password:'123',
    },
    {
        id:2,
        username:'kapoor',
        password:'456',
    },
    {
        id:3,
        username:'rohit',
        password:'789',
    }
];


app.post('/api/login', (req,res)=>{
    const{username, password} = req.body;
    
    for(let user of users){
        if(username == user.username && password == user.password){
            // In the NodeJS, change the JWT expire to 3 minutes
            let token = jwt.sign({id: user.id, username:user.username}, secretKey,{expiresIn: 180});
            res.json({
                success:true,
                err:null,
                token
            });
            break;
        }
        else{
            res.status(401).json({
                success:false,
                token:null,
                err:'Username or Password is incorrect'
            });
        }
    }
});

app.get('/api/dashboard', jwtMW, (req,res)=>{
    res.json({
        success:true,
        myContent: 'Secret content only logged in people can see.'
    });
});

app.get('/api/prices', jwtMW, (req,res)=>{
    
    res.json({
        success:true,
        myContent: 'Price is $3.99'
    });
});

app.get('/api/settings', jwtMW, (req,res)=>{
    
    res.json({
        success:true,
        myContent: 'This is settings'
    });
});

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname,'index.html'));
});

app.use(function (err,req,res,next){
    console.log(err.name === 'UnauthorizedError');
    console.log('err');
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({
            success:false,
            officialError:err,
            err: 'Username or Password is incorrect 2'
        });
    }
    else{
        next(err);
    }
})

app.listen(PORT, () =>{
    console.log(`Serving on port ${PORT}`);
});

