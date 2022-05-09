const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    //console.log('CHECK SUCCESSFUL: Your token: ' + token);
    const decoded = jwt.verify(token, 'ACCESS_TOKEN_SECRET');
    req.user = decoded;
    console.log("aaaaaaaaa"),
    console.log(decoded)
    console.log("decoded")
    next();
  } catch (error) {
    // 401: unauthenticated
    return res.status(401).json({
      message: 'Auth failed'
    });
  }
}