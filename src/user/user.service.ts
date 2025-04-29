import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getProfile() {
    return { name: 'John Doe', age: 30 };
  }
}
