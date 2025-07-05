const bcrypt = require('bcryptjs');

const comparePassword =(password,hashed)=> {
    return bcrypt.compare(password,hashed)
}

module.exports={
    // hashPassword,
    comparePassword,
    

} 