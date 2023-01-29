export type responseWToken = {
  id: string;
  email: string;
  token: string;
  isAdmin: boolean;
};

export type AuthorizationRequest = Request<
  ParamsDictionary,
  any,
  any,
  ParsedQs,
  Record<string, any>
> & {
  headers: { authorization: string };
  userData: { userId: string };
  userData: responseWToken;
};

export type RequestWUser = Request<
  ParamsDictionary,
  any,
  any,
  ParsedQs,
  Record<string, any>
> & { userData: { userId: string } };

export type MulterRequest = Request<
  ParamsDictionary,
  any,
  any,
  ParsedQs,
  Record<string, any>
>;
