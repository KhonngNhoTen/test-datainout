import { PartialDataTransfer } from 'datainout/reporters';
import { AppDataSource } from 'datasource.config';
import { User } from 'src/entities/user.entity';
import { fakeUser } from 'src/fake-data/fakeUser';
import { Repository } from 'typeorm';
// export class FakeUserPartial extends PartialDataTransfer {
//   private page = 1;
//   private pagePerItems = 200000;
//   constructor() {
//     super(10);
//   }
//   async get(): Promise<{ items: any[] | null; hasNext: boolean }> {
//     const hasNext = this.page > 0;
//     this.page--;

//     return { items: !hasNext ? null : fakeUser(this.pagePerItems), hasNext };
//   }
// }

export class UserPartial extends PartialDataTransfer {
  private BATCH_SIZE = 8000;
  private offsets: number[];
  private userRepo: Repository<User>;

  totalTimeQuery = 0;
  constructor() {
    super(4, 5);
    this.totalTimeQuery = 0;
    this.userRepo = AppDataSource.getRepository(User);
    this.offsets = [0, 0, 0, 0].map((e, i) => i * this.BATCH_SIZE);
  }

  async fetchBatch(
    jobIndex: number,
  ): Promise<{ items: any[] | null; hasNext: boolean }> {
    const offset = this.offsets[jobIndex];
    this.offsets[jobIndex] += this.BATCH_SIZE * this.jobCount;
    const items = await this.userRepo.find({
      skip: offset,
      take: this.BATCH_SIZE,
    });
    return { items, hasNext: items.length === this.BATCH_SIZE };
  }
  protected override bindJob2Sheet(
    jobIndex: number,
    originalSheetName: string,
  ): null | string {
    return jobIndex < 2 ? originalSheetName : `${originalSheetName}-2`;
  }
}
