type AnyObject = Record<string, any>;

function isCreateLike(prop: string) {
  return [
    'create',
    'update',
    'upsert',
    'delete',
    'connect',
    'disconnect',
    'updateMany',
    'createMany',
    'deleteMany'
  ].includes(prop);
}

function isFindUniqueLike(prop: string) {
  return ['findUnique', 'findFirst', 'findMany'].includes(prop);
}

function isCountLike(prop: string) {
  return prop === 'count';
}

function isAggregateLike(prop: string) {
  return ['aggregate', 'groupBy'].includes(prop);
}

function createModelProxy(name: string): any {
  return new Proxy(
    {},
    {
      get(_target, property) {
        const prop = String(property);
        if (prop === 'then') return undefined;

        if (isCountLike(prop)) {
          return async (_args?: any) => 0;
        }

        if (isFindUniqueLike(prop)) {
          return async (_args?: any) => {
            if (prop === 'findMany') return [];
            return null;
          };
        }

        if (isCreateLike(prop)) {
          return async (args?: any) => ({
            id: `${name.toLowerCase()}-stub`,
            ...(args?.data ?? {})
          });
        }

        if (isAggregateLike(prop)) {
          return async (_args?: any) => ({});
        }

        if (prop === '$disconnect' || prop === '$connect') {
          return async () => undefined;
        }

        if (prop === '$transaction') {
          return async (ops: any) => {
            if (typeof ops === 'function') return ops();
            return [];
          };
        }

        return createModelProxy(`${name}.${prop}`);
      }
    }
  );
}

export class PrismaClient {
  [key: string]: any;

  constructor() {
    return new Proxy(this, {
      get: (_target, property) => {
        const prop = String(property);
        if (prop === 'then') return undefined;

        if (prop === '$connect' || prop === '$disconnect') {
          return async () => undefined;
        }

        if (prop === '$transaction') {
          return async (ops: any) => {
            if (typeof ops === 'function') return ops();
            return [];
          };
        }

        return createModelProxy(prop);
      }
    }) as any;
  }
}
