import quick from "quick-store";

interface Database<Model> { [key: string]: Model; }
type AnyValue = string | number | Database<AnyValue> | Array<AnyValue> | boolean | null;

export function createQuickDatabase<Model = AnyValue>(name: string) {
  const db = quick(`./database/${name}.json`);
  return {
    get: key => key ?
      new Promise<Model>(resolve => {
        db.getItem(key, r => resolve(r as unknown as Model));
      }) :
      new Promise<Database<Model>>(resolve => {
        db.get(r => resolve(r as unknown as Database<Model>));
      }),
    set: (key, value) => new Promise(resolve => {
      db.setItem(key, value as never, r => resolve(r as unknown as Database<Model>));
    }),
    delete: key => new Promise(resolve => {
      db.removeItem(key, r => resolve(r as unknown as Database<Model>));
    }),
    put: obj => new Promise(resolve => {
      db.put(obj as never, r => resolve(r as unknown as Database<Model>));
    }),
    reset: () => new Promise(resolve => {
      db.clear(r => resolve(r as unknown as Database<Model>));
    }),
  } as {
    get(): Promise<Database<Model>>;
    get(key: string): Promise<Model>;
    set(key: string, value: Model): Promise<Database<Model>>;
    delete(key: string): Promise<Database<Model>>;
    put(obj: Database<Model>): Promise<Database<Model>>;
    reset(): Promise<Database<Model>>;
  };
}
