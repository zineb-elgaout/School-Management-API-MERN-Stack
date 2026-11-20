const userRepository = require('../repositories/userRepository');
const AppError = require('../errors/AppError');
const { hashPassword, verifyPassword } = require('../utils/password');
const { signToken } = require('../utils/token');

const MIN_PASSWORD_LENGTH = 8;

const normalizeEmail = (email) => {
  if (typeof email !== 'string' || email.trim() === '') {
    throw new AppError(400, 'Email is required');
  }

  return email.trim().toLowerCase();
};

const toSafeUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
});

const toDuplicateEmailError = (error) => {
  if (error.code === 11000) {
    return new AppError(409, 'Email already registered');
  }

  return error;
};

const buildSession = (user) => ({
  token: signToken({ userId: user._id, role: user.role }),
  user: toSafeUser(user),
});

const login = async ({ email, password } = {}) => {
  if (typeof email !== 'string' || !email || typeof password !== 'string' || !password) {
    throw new AppError(400, 'Email and password are required');
  }

  const user = await userRepository.findByEmail(normalizeEmail(email));

  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid credentials');
  }

  return buildSession(user);
};

const register = async ({ name, email, password } = {}) => {
  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof email !== 'string' ||
    !email ||
    typeof password !== 'string' ||
    !password
  ) {
    throw new AppError(400, 'Name, email and password are required');
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(
      400,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
    );
  }

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await userRepository.findByEmail(normalizedEmail);

  if (existingUser) {
    throw new AppError(409, 'Email already registered');
  }

  try {
    const user = await userRepository.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await hashPassword(password),
      role: 'admin',
    });

    return buildSession(user);
  } catch (error) {
    throw toDuplicateEmailError(error);
  }
};

const getCurrentUser = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return toSafeUser(user);
};

module.exports = {
  login,
  register,
  getCurrentUser,
  normalizeEmail,
  toSafeUser,
};
