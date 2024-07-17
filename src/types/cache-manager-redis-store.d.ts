import { Store, Config } from 'cache-manager';

declare module 'cache-manager-redis-store' {
  interface RedisStore extends Store {
    get<T = any>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    reset(): Promise<void>;
    mset<T = any>(args: Array<{ key: string; value: T }>, ttl?: number): Promise<void>;
    mget<T = any>(...args: string[]): Promise<T[]>;
  }

  interface RedisStoreConfig extends Config {
    host?: string;
    port?: number;
    auth_pass?: string;
    url?: string;
    tls?: any;
  }
}

declare const redisStore: typeof import('cache-manager-redis-store');
export = redisStore;
