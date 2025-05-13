const { exchangePartners } = require('../models/exchange');
const userModel = require('../models/user');

exports.getExchangePartners = async (req, res, next) => {
  try {
    // const exchangePartners = await exchangeModel.getAll();
    res.status(200).json(exchangePartners);
  } catch (error) {
    next(error);
  }
};

exports.getLinkedExchanges = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    res.status(200).json(user.linkedExchanges);
  } catch (error) {
    next(error);
  }
};