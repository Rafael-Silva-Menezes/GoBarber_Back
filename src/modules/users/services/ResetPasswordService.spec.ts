import 'reflect-metadata';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';
// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokenRepository from '../repositories/fakes/FakeUsersTokenRepository';

let fakeUserRepository: FakeUsersRepository;
let fakeUserTokens: FakeUsersTokenRepository;
let resetPasswordService: ResetPasswordService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeUserTokens = new FakeUsersTokenRepository();

    resetPasswordService = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokens,
    );
  });
  it('should be able to reset password', async () => {
    const user = await fakeUserRepository.create({
      email: 'JohnDoe@gmail.com',
      name: 'John Doe',
      password: '123456',
    });

    const { token } = await fakeUserTokens.generate(user.id);

    await resetPasswordService.execute({
      password: '123123',
      token,
    });
    const updateUser = await fakeUserRepository.findById(user.id);

    expect(updateUser?.password).toBe('123123');
  });
});
