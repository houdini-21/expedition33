import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

type JwtPayload = { sub: string; email: string };

function cookieExtractor(req: Request): string | null {
  if (req?.cookies && req.cookies['session']) {
    return req.cookies['session'];
  }
  return null;
}

/* The JwtStrategy class in TypeScript is used for validating JWT tokens and extracting user
information from the payload. */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
