import { uuid } from 'uuidv4';

import UserToken from '../../infra/typeorm/entities/UserToken';
import IUsersTokenRepository from '../IUsersTokenRepository';

class FakeUsersTokenRepository implements IUsersTokenRepository {
  private users: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
    });

    this.users.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.users.find(user => user.token === token);

    return userToken;
  }
}

export default FakeUsersTokenRepository;
