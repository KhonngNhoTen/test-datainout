// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class CreateUserTable1751124334254 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`
//       CREATE TABLE "user" (
//         "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
//         "name" character varying NOT NULL,
//         "email" character varying NOT NULL,
//         "password" character varying NOT NULL,
//         "phone" character varying NOT NULL,
//         "age" integer NOT NULL,
//         "dob" TIMESTAMP NOT NULL,
//         CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
//       )
//     `);
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`DROP TABLE "user"`);
//   }
// }
