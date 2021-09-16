import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";
@Injectable()
export class IsValidId implements PipeTransform {
  transform(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("ID invalido");
    }
    return id;
  }
}
