var express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
var router = express.Router();

// var bcrypt = require('../utils/bcrypt');

var jwt = require('../utils/jwt');

var mgdb = require('../utils/mgdb')

/* GET home page. */
router.get('/', function(req, res, next) {

  // res.render('index', { title: 'Express' });
  // console.log('query',req.query)
  // console.log('body',req.body)
  // console.log('file',req.files)
  // console.log('file',req.headers.token)

  // console.log('bcrypt',bcrypt.hashSync(req.body.password));// 加密

  // let hash = bcrypt.hashSync(req.body.password);

  // console.log('bcrypt.compareSync： ',bcrypt.compareSync(req.body.password,hash+"玛莎拉蒂"))

  let token = jwt.sign({username:'alex',_id:"234249782934729423"});
  console.log(token);

  jwt.verify(token).then(res=>console.log(res)).catch(err=>console.log(err))


  /* mgdb.open({collectionName:'user'}).then(
    ({collection,client})=>collection.insertOne({username:'艾利克斯'},(err,res)=>{
      console.log('res',res.result.n)
      console.log('res',res.ops)
      console.log('res',res.insertedId)
      client.close()
    })
  ) */

  mgdb.findList({collectionName:'banner',q:'a'}).then(
    res=>console.log(res)
  )


});

module.exports = router;
