import 'reflect-metadata';

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '../../../shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersTokenRepository from '../repositories/fakes/FakeUsersTokenRepository';

let fakeUserRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokens: FakeUsersTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokens = new FakeUsersTokenRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokens,
    );
  });
  it('should be able to recover password usign the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      email: 'JohnDoe@gmail.com',
      name: 'John Doe',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'JohnDoe@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should be able to recover password no-existing user email', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'JohnDoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password  token', async () => {
    const generateToken = jest.spyOn(fakeUserTokens, 'generate');

    const user = await fakeUserRepository.create({
      email: 'JohnDoe@gmail.com',
      name: 'John Doe',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'JohnDoe@gmail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
