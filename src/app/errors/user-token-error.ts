export class UserTokenError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = UserTokenError.name;
    Object.setPrototypeOf(this, UserTokenError.prototype);
  }
}
