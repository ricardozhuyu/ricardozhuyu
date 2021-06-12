let mongodb = require('mongodb');
let mongoCt = mongodb.MongoClient;
let ObjectId = mongodb.ObjectId;//对id做包装

//连接库
let open = ({ dbName, collectionName, url = 'mongodb://127.0.0.1:27017' }) => {
  return new Promise((resolve, reject) => {
    mongoCt.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        reject({ collection, client, err })
      } else {
        let db = client.db(dbName)
        let collection = db.collection(collectionName);
        resolve({ collection, client })
      }
    })
  })
};

//查列表
let findList = ({ collectionName, dbName, _page, _limit, _sort, q }) => {

  // let rule = q ? {username: new RegExp(q,i)} : {}
  let rule = q ? {username: eval('/' + q + '/') } : {}

  return new Promise((resolve, reject) => {



    //连接库
    open({ dbName, collectionName })
      .then(({ collection, client }) => {
        collection.find(rule,{
          skip: _page * (_limit - 0),
          limit: _limit,
          // projection:{}
          sort: {[_sort]:1}
        }).toArray((err,result)=>{
          if(!err && result.length>0){
            resolve({
              err:0,
              msg:'成功',
              data:result
            })
          }else{
            resolve({
              err:1,
              msg:'没有数据'
            })
          }

          client.close();
        })
      })
      .catch(({ client }) => {
        reject({ err: 1, msg: '库连接失败' });
        client.close();
      })

  })
};


//查详情
let findDetail = ({collectionName,dbName,_id = null}) => { 
  console.log(12321);
  return new Promise((resolve,reject)=>{
    console.log(_id);
    open({dbName,collectionName}).then(({ collection, client })=>{
      collection.find({
        _id: ObjectId(_id)//接受到的是字符id ,需要转换ObjectId
      },{
        projection:{_id:0}
      }).toArray((err,result)=>{
        console.log(_id);
        if(!err && result.length>0){
          resolve({
            err:0,
            msg:'成功',
            data:result[0]//返回给前端的是一个对象
          })
        }else{
          resolve({
            err:1,
            msg:'查无数据'
          })
        }
        client.close();
      })}
    )
      
      .catch(({ client }) => {
      reject({ err: 1, msg: '库连接失败' });
      client.close();
    })
  })
};

exports.open = open;
exports.findList = findList;
exports.findDetail = findDetail;