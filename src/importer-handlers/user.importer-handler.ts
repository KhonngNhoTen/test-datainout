import { User } from 'src/entities/user.entity';
import { ImporterHandler } from 'datainout/importers';
import { Repository } from 'typeorm';
import { AppDataSource } from 'datasource.config';
export class UserImporterHandler extends ImporterHandler<User> {
  userRepository: Repository<User>;
  constructor() {
    super(false);
    this.userRepository = AppDataSource.getRepository(User);
  }
  async handleChunk(chunks: User[]) {
    await this.userRepository.insert(chunks);
  }

  protected async catch(error: Error) {
    console.error(error);
  }
}
