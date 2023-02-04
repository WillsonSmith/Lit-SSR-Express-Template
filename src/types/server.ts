import { Request, Response } from 'express';

type Locals = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type RequestWithLocals = Request & {
  locals: Locals;
};
