export type FailEmit = { status: false; error: string; data?: unknown };

export type EmitResult<T> = (T & { status: true }) | FailEmit;
