const axios = require('axios');
const catchAsync = require('../utils/catchAsync');

exports.convertEthToUsd = catchAsync(async (req, res, next) => {
  const { ethAmount } = req.body;

  if (!ethAmount || isNaN(ethAmount)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide a valid ethAmount'
    });
  }

  const response = await axios.get(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
  );

  const ethPriceInUsd = response.data.ethereum.usd;
  const totalUsd = ethAmount * ethPriceInUsd;

  res.status(200).json({
    status: 'success',
    data: {
      ethAmount,
      usdPricePerEth: ethPriceInUsd,
      totalUsd: totalUsd.toFixed(2)
    }
  });
});
