export const SERVER_ERROR = "ServerError";

export class ServerError extends Error implements Error {
  private _status: number;

  constructor(message: string, status = 500) {
    super(message);
    super.name = SERVER_ERROR;

    this._status = status;

    Object.setPrototypeOf(this, ServerError.prototype);
  }

  public get status() {
    return this._status;
  }
}
