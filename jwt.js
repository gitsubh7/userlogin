import jwt from 'jsonwebtoken';

function createToken(user) {
  return jwt.sign({ id: user._id },"okokokok", {
    expiresIn: '30d'
  });
}

export default createToken;
