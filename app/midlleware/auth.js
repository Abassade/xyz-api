const jwt = require('jsonwebtoken');
const Response = require('../constants/response');
const httpStatus = require('../constants/httpStatus');

module.exports = (req, res, next)=> {
    try{
        const token = req.headers.authorization.split(" ")[1];

        if(token.length<0){
            return Response.failure(res, { message: 'Oga you never pass token in header', }, httpStatus.UNAUTHORIZED);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userToken = decoded;
        next();
    }
    catch(error){
        return Response.failure(res, { message: 'Invalid token passed', }, httpStatus.UNAUTHORIZED);
    }
}