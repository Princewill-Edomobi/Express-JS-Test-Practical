const mongoose = require("mongoose");

const Provider = require("../models/provider");

exports.provider_create = async(req, res, next) => {
    const new_provider = new Provider({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name
    });
    new_provider.save()
        .then(result => {return res.status(200).json(result);})
        .catch(err => {res.status(500).json(err);});
};

exports.provider_get_all = (req, res, next) => {
  Provider.find()
  .exec()
  .then(docs => {res.status(200).json(docs);})
  .catch(err => {res.status(500).json(err);});
};

exports.provider_get = (req, res, next) => {
  Provider.findById(req.params.providerId)
    .exec()
    .then(docs => {res.status(200).json(docs);})
    .catch(err => {res.status(500).json(err);});
};

exports.provider_delete = (req, res, next) => {
  Provider.deleteOne({ _id: req.params.providerId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Provider deleted"
      });
    })
    .catch(err => {res.status(500).json(err);});
};

exports.provider_update = (req, res, next) => {
  Provider.findOneAndUpdate({_id: req.params.providerId}, req.body, {new : true})
          .exec()
          .then(result => { res.status(200).json(result);})
          .catch(err => {res.status(500).json(err);});
};