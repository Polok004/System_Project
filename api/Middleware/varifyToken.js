import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log('Retrieved Token:', token); // Debugging token presence

  if (!token) return res.status(401).json({ message: 'Not Authenticated!' });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      console.error('Token verification error:', err); // Debug token validation
      return res.status(403).json({ message: 'Token is not Valid!' });
    }
    req.userId = payload.id;
    console.log('Decoded Token Payload:', payload); // Debug token content
    next();
  });
};

