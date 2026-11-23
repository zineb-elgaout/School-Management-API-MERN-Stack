jest.mock('../../../src/repositories/userRepository');
jest.mock('../../../src/utils/password', () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
}));
jest.mock('../../../src/utils/token', () => ({
  signToken: jest.fn(),
}));

const userRepository = require('../../../src/repositories/userRepository');
const { hashPassword, verifyPassword } = require('../../../src/utils/password');
const { signToken } = require('../../../src/utils/token');
const authService = require('../../../src/services/authService');

const buildUser = (overrides = {}) => ({
  _id: 'user-1',
  name: 'Admin User',
  email: 'admin@edunode.com',
  password: 'hashed-password',
  role: 'admin',
  ...overrides,
});

describe('authService.login', () => {
  it('requires email and password', async () => {
    await expect(authService.login({})).rejects.toMatchObject({ statusCode: 400 });
  });

  it('rejects unknown emails', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({ email: 'missing@edunode.com', password: 'secret123' })
    ).rejects.toMatchObject({ statusCode: 401 });

    expect(userRepository.findByEmail).toHaveBeenCalledWith('missing@edunode.com');
  });

  it('rejects invalid passwords', async () => {
    userRepository.findByEmail.mockResolvedValue(buildUser());
    verifyPassword.mockResolvedValue(false);

    await expect(
      authService.login({ email: 'admin@edunode.com', password: 'wrong' })
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it('returns a token and a safe user on success', async () => {
    userRepository.findByEmail.mockResolvedValue(buildUser());
    verifyPassword.mockResolvedValue(true);
    signToken.mockReturnValue('signed-token');

    const result = await authService.login({
      email: ' Admin@EduNode.com ',
      password: 'secret123',
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith('admin@edunode.com');
    expect(signToken).toHaveBeenCalledWith({ userId: 'user-1', role: 'admin' });
    expect(result).toEqual({
      token: 'signed-token',
      user: {
        id: 'user-1',
        name: 'Admin User',
        email: 'admin@edunode.com',
        role: 'admin',
      },
    });
    expect(result.user).not.toHaveProperty('password');
  });

  it('signs the token with the role of a registered user', async () => {
    userRepository.findByEmail.mockResolvedValue(buildUser({ role: 'user' }));
    verifyPassword.mockResolvedValue(true);
    signToken.mockReturnValue('user-token');

    const result = await authService.login({
      email: 'admin@edunode.com',
      password: 'secret123',
    });

    expect(signToken).toHaveBeenCalledWith({ userId: 'user-1', role: 'user' });
    expect(result.user.role).toBe('user');
  });
});

describe('authService.register', () => {
  it('requires name, email and password', async () => {
    await expect(authService.register({})).rejects.toMatchObject({ statusCode: 400 });
  });

  it('enforces a minimum password length', async () => {
    await expect(
      authService.register({
        name: 'Admin',
        email: 'admin@edunode.com',
        password: 'short',
      })
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it('rejects an already registered email', async () => {
    userRepository.findByEmail.mockResolvedValue(buildUser());

    await expect(
      authService.register({
        name: 'Admin',
        email: 'admin@edunode.com',
        password: 'secret123',
      })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it('creates a standard user with a hashed password', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    hashPassword.mockResolvedValue('hashed-password');
    userRepository.create.mockResolvedValue(buildUser({ role: 'user' }));
    signToken.mockReturnValue('signed-token');

    const result = await authService.register({
      name: ' Admin User ',
      email: 'Admin@EduNode.com',
      password: 'secret123',
    });

    expect(hashPassword).toHaveBeenCalledWith('secret123');
    expect(userRepository.create).toHaveBeenCalledWith({
      name: 'Admin User',
      email: 'admin@edunode.com',
      password: 'hashed-password',
      role: 'user',
    });
    expect(result.token).toBe('signed-token');
    expect(result.user.role).toBe('user');
  });

  it('maps duplicate-key errors to a 409', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    hashPassword.mockResolvedValue('hashed-password');
    userRepository.create.mockRejectedValue({ code: 11000 });

    await expect(
      authService.register({
        name: 'Admin',
        email: 'admin@edunode.com',
        password: 'secret123',
      })
    ).rejects.toMatchObject({ statusCode: 409 });
  });
});

describe('authService.getCurrentUser', () => {
  it('returns 404 when the user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(authService.getCurrentUser('missing')).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('returns a safe user', async () => {
    userRepository.findById.mockResolvedValue(buildUser());

    await expect(authService.getCurrentUser('user-1')).resolves.toEqual({
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@edunode.com',
      role: 'admin',
    });
  });
});
