const jwt = require('jsonwebtoken');
const User = require('./../models/User')
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader)
    if (typeof bearerHeader !== 'undefined') {
      const bearerToken = bearerHeader;
      req.token = bearerToken;
      jwt.verify(bearerToken, process.env.SECRET_KEY, async (err, authData) => {
        if (err) {
            console.log('how did we get here')
          res.sendStatus(403);
        } else {
          const user = await User.findOne({ _id: authData.userId });
          if (!user) {
            res.status(404).json({ error: 'User not found' });
          } else {
            req.user = user; // Set the user property of the req object to the retrieved user data
            next();
          }
        }
      });
    } else {
      res.sendStatus(403);
    }
  }
  
module.exports = verifyToken;   