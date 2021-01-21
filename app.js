const express = require('express');
const session = require('express-session');
const cookirParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const sanitizeHtml = require('sanitize-html');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');

dotenv.config();


const app = express();
app.set('port', process.env_PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express : app,
    watch : true,
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser(process.env.COOKIESECRET));

app.use(session({
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIESECRET,
    cookie : {
        httpOnly : true,
        secure : false,
    },
}));

app.use((req,res,next)=>{ 

    const error = new Error();
    next(error);
});

app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});