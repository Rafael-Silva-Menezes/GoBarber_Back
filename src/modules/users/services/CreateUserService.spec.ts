import 'reflect-metadata';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
  it('should be able to create new user', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      email: 'user@gmail.com',
      name: 'User Name',
      password: 'Password2021',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with the same email from another', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      email: 'user@gmail.com',
      name: 'User Name',
      password: 'Password2021',
    });

    expect(
      createUser.execute({
        email: 'user@gmail.com',
        name: 'User Name',
        password: 'Password2021',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
