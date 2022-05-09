const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    //console.log('CHECK SUCCESSFUL: Your token: ' + token);
    const decoded = jwt.verify(token, 'refresh_token');
    req.user = decoded;
    next();
  } catch (error) {
    // 401: unauthenticated
    return res.status(401).json({
      message: res.message
    });
  }
}