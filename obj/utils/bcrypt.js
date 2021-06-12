let bcrypt = require("bcryptjs");

module.exports = {
    hashSync:(password)=>bcrypt.hashSync(password, 10),
    compareSync:(sendPassword, hash) =>{
       return bcrypt.compareSync(sendPassword, hash);
    }
}
