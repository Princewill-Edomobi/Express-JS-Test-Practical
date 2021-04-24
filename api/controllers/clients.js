const mongoose = require("mongoose");

const Client = require("../models/client");

exports.client_create = async(req, res, next) => {
    const new_client = new Client({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        providers: req.body.providers
    });
    new_client.save()
        .then(result => {return res.status(200).json(result);})
        .catch(err => {
          res.status(500).json(err);});
};

exports.client_get_all = (req, res, next) => {
  let sort = {}
  if(req.query.field && req.query.order){
    sort[req.query.field] = req.query.order;
  }
  Client.find()
  .sort(sort)
  .populate('providers')
  .exec()
  .then(docs => {res.status(200).json(docs);})
  .catch(err => {res.status(500).json(err);});
};

exports.client_get = (req, res, next) => {
  Client.findById(req.params.clientId)
    .populate('providers')
    .exec()
    .then(docs => {res.status(200).json(docs);})
    .catch(err => {res.status(500).json(err);});
};

exports.client_delete = (req, res, next) => {
  Client.deleteOne({ _id: req.params.clientId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Client deleted"
      });
    })
    .catch(err => {res.status(500).json(err);});
};

exports.client_update = (req, res, next) => {
  Client.findOneAndUpdate({_id: req.params.clientId}, req.body, {new : true})
          .populate('providers')
          .exec()
          .then(result => { res.status(200).json(result);})
          .catch(err => {res.status(500).json(err);});
};