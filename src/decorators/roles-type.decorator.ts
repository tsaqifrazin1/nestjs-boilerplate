import { SetMetadata } from '@nestjs/common';

export const RolesTypeDecorators = (...rolesType: string[]) =>
  SetMetadata('rolesType', rolesType);
