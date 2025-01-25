import { UserDAO } from '@/@v2/auth/database/dao/user/user.dao';
import { UserRepository } from '@/@v2/auth/database/repositories/entities/user/user.repository';
import { GoogleAdapter } from '@/@v2/shared/adapters/google/google.interface';
import { HashAdapter } from '@/@v2/shared/adapters/hash/models/hash.interface';
import { SharedTokens } from '@/@v2/shared/constants/tokens';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ISigninUseCase } from './sign-in.types';

@Injectable()
export class SignInUseCase {
  constructor(
    @Inject(SharedTokens.Hash)
    private readonly hashAdapter: HashAdapter,
    @Inject(SharedTokens.Hash)
    private readonly googleAdapter: GoogleAdapter,
    private readonly userRepository: UserRepository,
    private readonly userDAO: UserDAO,
  ) {}

  async execute(params: ISigninUseCase.Params) {
    const user = await this.userRepository.findByToken(params);
    if (!user) throw new BadRequestException('Somente usuários convidados podem se cadastrar');
    if (user.hasAccess) throw new BadRequestException('Usuário já cadastrado');

    const googleCredentials = await this.getGoogleCredentials(params);
    if (googleCredentials) {
      user.googleExternalId = googleCredentials.uid;
      user.photoUrl = googleCredentials.photoURL;
    }

    //check if user already exists
    const email = googleCredentials?.email || params.email || '';
    const userExists = await this.userDAO.checkIfExist({ email, googleExternalId: user.googleExternalId });
    if (userExists) throw new BadRequestException('Usuário já cadastrado');

    //set user password
    if (params.password) {
      const passHash = await this.hashAdapter.createHash(params.password);
      user.password = passHash;
    }

    //set user email
    const isValidEmail = user.setEmail(email);
    if (!isValidEmail) throw new BadRequestException('Email inválido');

    //update user
    if (!user.hasAccess) throw new BadRequestException('Credênciais inválidas');
    const updatedUser = await this.userRepository.update(user);
    if (!updatedUser) throw new BadRequestException('Erro ao atualizar usuário');

    return { id: updatedUser.id };
  }

  private getGoogleCredentials = async (params: ISigninUseCase.Params) => {
    if (!params.googleToken) return null;

    const credentials = await this.googleAdapter.validateGoogleToken(params.googleToken);
    if (!credentials) throw new BadRequestException('Erro ao validar token do Google');

    return credentials.user;
  };
}
