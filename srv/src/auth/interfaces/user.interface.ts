import { $Enums } from '@prisma/client'

export interface User {
  id: string;
  name: string;
  email: string;
  Role: $Enums.Role
}
