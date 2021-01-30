const express = require('express');
const db = require('../models/index');
const {Op} = require('sequelize');
const router = express.Router();

// validate that the data string is an array of 256 integers of range(0,255)
const validateDataString = (str) =>{
  const arr = str.split(',');
  console.log(arr);
  if (arr.length === 256){
    for(a of arr){
      if(parseInt(a) === NaN){
        return false;
      }
    }
    return true;
  }
  return false;
}

// READ
router.get('/', async (req, res, next) => {
  try{
    const data = await db.User.findOne({
      attributes: ['id','username'],
      where:{
        username: req.user.username,
      },
      include: {
        model: db.Data,
        attributes: ["id", "data"],
      }
    });
    res.json({
      user: req.user,
      data: data.data,
    });
  } catch(error){
    return next(error);
  }
})

// CREATE
router.post('/', async (req, res, next) => {
  try{
    if(req.body.data){
      // Since we store the userId in the JWT, we shouldn't
      // have to query the DB to verify if the user exists.
      // We also have direct access to the userId without have to look up the ID

      // if(!validateDataString(req.body.data)){
      //   res.status(400).json({message: "Not a valid data string"});
      //   return;
      // }

      await db.Data.create({
        userId: req.user.userId,
        data: req.body.data,
      });
      res.sendStatus(200);
    }
    else res.sendStatus(400);
  } catch(error){
    return next(error);
  }
});

// UPDATE
router.put('/', async(req, res, next) => {
  try{
    if(req.body.data && req.body.id){

      // if(!validateDataString(req.body.data)){
      //   res.status(400).json({message:"Note a valid data string"});
      //   return;
      // }

      await db.Data.update({data:req.body.data},{
        where: {
          [Op.and]: [{userId:req.user.userId}, {id: req.body.id}],
        }
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch(error) {
    return next(error);
  }
})

// DELETE
router.delete('/', async(req, res, next) => {
  try{
    if(req.body.id){
      await db.Data.destroy({
        where: {
          [Op.and]:[{id: req.body.id}, {userId: req.user.userId}],
        }
      })
    } else {
      res.sendStatus(400);
    }
  } catch(error){
    return next(error);
  }
})
module.exports=router;