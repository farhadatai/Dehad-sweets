import { jwtDecode } from 'jwt-decode';

const isEmployee = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== 'EMPLOYEE') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default isEmployee;
