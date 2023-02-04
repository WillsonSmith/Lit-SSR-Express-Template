import { Request } from 'express';
import { UserWithRole } from './User';

type Locals = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type RequestWithLocals = Request & {
  authenticated?: boolean;
  user?: UserWithRole;
  locals: Locals;
};
