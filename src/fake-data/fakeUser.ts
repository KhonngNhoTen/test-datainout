import { User } from 'src/entities/user.entity';

function randomInt(min: number = 0, max: number = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomString(length: number = 8): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(
    { length },
    () => chars[randomInt(0, chars.length - 1)],
  ).join('');
}

export function fakeUser(size: number) {
  const arr: any[] = [];
  for (let i = 0; i < size; i++) {
    const user = {
      age: randomInt(1, 100),
      dob: new Date(),
      email: `${randomString(6)}@gmail.com`,
      name: randomString(9),
      password: randomString(7),
      phone: randomString(10),
    };
    arr.push(user);
  }

  return arr;
}
