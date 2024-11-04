import jwt from 'jsonwebtoken';

function createToken(user) {
  return jwt.sign({ id: user._id },process.env.SECRET_KEY, {
    expiresIn: '30d'
  });
}
const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) return res.json({ error: "User not logged in" });

  try {
    const validToken = jwt.verify(accessToken, process.env.SECRET_KEY);
    if (validToken) {
     req.authenticated=true;
     return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
}

export { createToken, validateToken };
