import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.model';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { hashSync } from 'bcrypt';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', async function (next) {
            if (this.isModified('password')) {
              this.password = hashSync(this.password, 10);
              next();
            }
            next();
          });
          return schema;
        },
      },
    ]),
  ],
  providers: [UserResolver, UserService],
})
export class UserModule {}
