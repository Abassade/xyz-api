/**
 * @Author: Abass
 * @Date: 20|09|2019
 * @Objective: building to scale
 */

const httpStatus = require('../constants/httpStatus');
const Response = require('../constants/response');
const utils = require('../lib/utils');
const service = require('../services/xyz');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class Xyz {
  /**
     *
     * @param {*} logger
     * @param {*} XYZService
     */
  constructor(logger, XYZService) {
    this.logger = logger;
    this.XYZService = XYZService;
  }

  registerUser(req, res) {
      
    this.logger.info('This is just registering...');
    let { email, password, cPassword, country, number, firstname, lastname, sponsorID} = req.body
    if(!email || !password || !cPassword || !country || !number || !firstname || !lastname){
        return Response.failure(res, { message: 'registration fields are required', }, httpStatus.BAD_REQUEST);
    }
    if(!email.includes('@')){
        return Response.failure(res, { message: 'invalid email format', }, httpStatus.BAD_REQUEST);
    }
    if(password !== cPassword){
        return Response.failure(res, { message: 'password do not match', }, httpStatus.BAD_REQUEST);
    }
    bcrypt.hash(password, 10, (err, hpass) => {
        if(err){
            return Response.failure(res, { message: 'error occured', response: err }, httpStatus.INTERNAL_SERVER_ERROR);
        }
        if(!err){
            this.XYZService.getUser({email: email})
            .then( user =>{
                if(user){
                    return Response.success(res, { message: 'email already exists', response: user.email }, httpStatus.OK);
                }
                if(!user){
                    req.body.password = hpass;
                    req.body.cPassword = hpass;
                    this.XYZService.saveUser(req.body)
                .then(async user =>{
                    let data = {
                        user_id: user._id,
                        full_name: `${user.firstname} ${user.lastname}`,
                        email: user.email
                    }
                    // create user dashboard here!!!
                    let dashboardData = await utils.userDashboradData(req.body);
                    this.XYZService.saveUserProfile(dashboardData)
                    .then( resp => {
                        return Response.success(res, {
                            message: 'successfully registered user',
                            response: data
                        }, httpStatus.CREATED);
                    }).catch( error =>{
                        return Response.failure(res, { message: 'cannot create profile', response: error }, httpStatus.INTERNAL_SERVER_ERROR);
                    })
                }).catch(error =>{
                    return Response.failure(res, { message: 'unable to register user', response: error }, httpStatus.INTERNAL_SERVER_ERROR);
                })
     
                }
            })
        }
    });
  }

  LoginUser(req, res) {
    this.logger.info('This is just login ...');
    const { email, password } = req.body;
    if(!email.includes('@')){
        return Response.failure(res, { message: 'invalid email format', }, httpStatus.BAD_REQUEST);
    }
    if(!email || !password){
        return Response.failure(res, { message: 'email and password required', }, httpStatus.BAD_REQUEST);
    }
    this.XYZService.getUser({email})
    .then( user =>{
        if(user){
            bcrypt.compare(password, user.password, async(err, result) => {
                if(err){
                    return Response.failure(res, { message: 'auth failed', }, httpStatus.BAD_GATEWAY);
                }
                if(!result){
                    return Response.failure(res, { message: 'incorrect password', }, httpStatus.BAD_REQUEST);
                }
                if(result){
                    const token = await jwt.sign({
                        email: user.email, userID: user._id
                    }, process.env.JWT_SECRET, { expiresIn: "2h" }
                    );
                    return Response.success(res, {
                        message: 'login successfully',
                        response: {id: user._id, token} }, httpStatus.OK);
                }
            })
        }
        else{
            return Response.failure(res, { message: 'you are not a user kindly register...', }, httpStatus.NOT_FOUND);

        }
    }).catch( error =>{
        return Response.failure(res, { message: 'error occured', response: error }, httpStatus.INTERNAL_SERVER_ERROR);            
    });
  }

  getAllUsers(req, res) {
    this.logger.info('This is just getting all users...');
    this.XYZService.getAllUser()
    .then( users =>{
        if(users){
            return Response.success(res, {
                message: 'successfully fetched users',
                response: users,
                    users }, httpStatus.OK);
        }
        return Response.failure(res, { message: 'no user found', }, httpStatus.NOT_FOUND);
    }).catch( error =>{
        return Response.failure(res, { message: 'error occured', response: error }, httpStatus.NOT_FOUND);
    });
  }

  static async isUser(param){
    try{
        const user = await new service().getUser(param);
        return user ? true : false;
    }
    catch(error){
        return console.info('error while finding user from (isUser)', error);
    }
  }
}

module.exports = Xyz;