export class HttpError extends Error {
  constructor(status, message) {
    super(`HttpError`);
    this.status = status;
    this.message = message || '';
    // Tiny hack to make extending error works
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
