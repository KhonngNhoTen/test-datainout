import { PartialDataTransfer } from 'datainout/reporters';
import { AppDataSource } from 'datasource.config';
import { User } from 'src/entities/user.entity';
import { fakeUser } from 'src/fake-data/fakeUser';
import { Repository } from 'typeorm';
import { clientPg } from '../../client.pg';
import Cursor from 'pg-cursor';

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

// class MyCursor {
//   private cursor: Cursor;

//   async init(client, sql: string) {
//     this.cursor = client.query(new Cursor(sql));
//   }

//   close() {
//     return new Promise((resolve, reject) => {
//       this.cursor.close(resolve);
//     });
//   }
//   read(BATCH_SIZE: number) {
//     return new Promise<any[]>((resolve, reject) => {
//       this.cursor.read(BATCH_SIZE, (err, rows) => {
//         if (err) return reject(err as Error);
//         resolve(rows);
//       });
//     });
//   }
// }

// class CursorReaderQueue {
//   private reading = false;
//   private queue: (() => void)[] = [];
//   private cursor: MyCursor;
//   private BATCH_SIZE: number;

//   constructor(cursor: MyCursor, BATCH_SIZE: number) {
//     this.cursor = cursor;
//     this.BATCH_SIZE = BATCH_SIZE;
//   }

//   async getNextBatch(): Promise<any[] | null> {
//     await this.enqueue(); // chờ đến lượt

//     const batch = await this.cursor.read(this.BATCH_SIZE);

//     this.dequeue(); // nhường quyền cho job tiếp theo

//     if (batch.length === 0) return null;
//     return batch;
//   }

//   private enqueue(): Promise<void> {
//     return new Promise((resolve) => {
//       if (!this.reading) {
//         this.reading = true;
//         resolve();
//       } else {
//         this.queue.push(resolve);
//       }
//     });
//   }

//   private dequeue() {
//     if (this.queue.length > 0) {
//       const next = this.queue.shift();
//       if (next) next();
//     } else {
//       this.reading = false;
//     }
//   }

//   async close() {
//     await this.cursor.close();
//   }
// }

// export class UserPartial extends PartialDataTransfer {
//   private BATCH_SIZE = 10000;
//   private queueCursor: CursorReaderQueue;

//   constructor() {
//     super(5, 5);
//   }

//   async fetchBatch(
//     jobIndex: number,
//   ): Promise<{ items: any[] | null; hasNext: boolean }> {
//     const items = await this.queueCursor.getNextBatch();
//     return { items: items ?? [], hasNext: items !== null };
//   }

//   private initQuery = (offset?: number, limit?: number): string => {
//     return `
//         WITH
//           used_total_by_user_history AS (
//             SELECT o.user_id, COALESCE(SUM(p.amount), 0) AS total_spent
//             FROM orders o
//             LEFT JOIN payments p ON p.order_id = o.id
//             GROUP BY o.user_id),
//           total_amount_and_quantity_by_order AS (
//             SELECT order_id, COUNT(*) AS order_amount, SUM(quantity) as order_quantity
//             FROM order_items
//             GROUP BY order_id),
//           ranked_orders AS (
//             SELECT o.id AS order_id, o.user_id, o.created_at, RANK() OVER (PARTITION BY o.user_id ORDER BY o.created_at DESC) AS rank, p.amount, p.method
//             FROM orders o
//             LEFT JOIN payments p on p.order_id = o.id),
//           anylyzed_by_orders AS NOT MATERIALIZED (
//             SELECT u.name AS user_name,u.email AS user_email, utsb.total_spent, ro.*, taaqbyo.order_amount, taaqbyo.order_quantity
//             FROM ranked_orders ro
//             LEFT JOIN "used_total_by_user_history" utsb ON ro.user_id = utsb.user_id
//             left join "total_amount_and_quantity_by_order" taaqbyo on taaqbyo.order_id = ro.order_id
//             LEFT JOIN users u ON u.id = ro.user_id),
//           analyzed_by_products AS NOT MATERIALIZED (
//             SELECT
//               p.id AS product_id,
//               p.name AS product_name,
//               b.name AS brand_name,
//               c.name AS category_name
//             FROM products p
//             LEFT JOIN brands b ON p.brand_id = b.id
//             LEFT JOIN categories c ON p.category_id = c.id)
//         SELECT
//         abo.order_id,
//         TO_CHAR(abo.created_at  AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD HH24:MI:SS') as order_time,
//         abo.user_name ,
//         abo.user_email,
//         abo.total_spent as user_total_spent,
//         abo.rank as user_order_rank,
//         abp.product_name ,
//         abp.brand_name,
//         abp.category_name,
//         s.name as shipper_name,
//         w.name as warehouse_name,
//         l.address as warehouse_address,
//         abo.amount as payment_amount,
//         abo.order_amount as total_items,
//         abo.order_quantity as quantity
//         FROM order_items oi
//         LEFT JOIN anylyzed_by_orders abo ON abo.order_id = oi.order_id
//         LEFT JOIN analyzed_by_products abp ON abp.product_id = oi.product_id
//         LEFT JOIN shippers s ON s.id = (1 + (oi.order_id % 10))
//     	  LEFT JOIN warehouses w ON w.id = (1 + ((oi.order_id  * 2) % 10))
//     	  LEFT JOIN locations l on l.id = w.location_id`;
//   };

//   async awake(): Promise<void> {
//     const sql = this.initQuery();
//     await clientPg.connect();
//     const cursor = new MyCursor();
//     await cursor.init(clientPg, sql);
//     this.queueCursor = new CursorReaderQueue(cursor, this.BATCH_SIZE);
//     console.log('TRANSFER INIT....');
//   }
//   async completed(): Promise<void> {
//     await this.queueCursor.close();
//     await clientPg.end();
//     console.log('TRANSFER DESTROY....');
//   }
//   protected bindJob2Sheet(
//     jobIndex: number,
//     originalSheetName: string,
//   ): null | string {
//     return jobIndex % 2 === 0 ? originalSheetName : `${originalSheetName}-2`;
//   }
// }
