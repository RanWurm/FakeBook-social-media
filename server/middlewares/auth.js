const jwt = require('jsonwebtoken');
const key = "133221333123111";

function authenticate (req, res, next) {
  console.log("in the authentication");
  const token = req.headers.authorization;

  if (!token) {
    console.log("In the if !token");
    return res.status(401).json({ error: "Unauthorized" });
  }
  console.log(token);
  try {
    console.log("In the try");
    const decoded = jwt.verify(token, key);
    req.user = decoded;
    console.log(decoded); 
    next();
  } catch (error) {
    console.log("auth -> line 19"); 
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = authenticate;