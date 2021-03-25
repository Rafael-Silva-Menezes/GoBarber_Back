import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUsersTokenRepository from '../repositories/IUsersTokenRepository';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepositorys: IUsersRepository,

    @inject('UsersTokenRepository')
    private tokenRepository: IUsersTokenRepository,
  ) {}

  public async execute({ password, token }: IRequest): Promise<void> {
    const userToken = await this.tokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User Token does not exist');
    }
    const user = await this.usersRepositorys.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exist');
    }

    user.password = password;

    await this.usersRepositorys.save(user);
  }
}

export default ResetPasswordService;
