/* eslint-disable @typescript-eslint/no-unused-vars */
import * as fastify from 'fastify'
import * as http from 'http'

declare module 'fastify' {
  export interface FastifyInstance<
    HttpServer = http.Server,
    HttpRequest = http.IncomingMessage,
    HttpResponse = http.ServerResponse,
  > {
    authenticate: typeof preValidationHookHandler
  }

  export interface FastifyRequestInterface {
    user: {
      exp: string
      iat: string
    }
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      /**
       * token expiration date in ms
       */
      exp?: number
      /**
       * token issued date in ms
       */
      iat?: number
      id: string
      email: string
      displayName: string
      signedUpAt: Date
      activatedAt?: Date
      lastLoggedInAt?: Date
      status: 'registered' | 'verified' | 'deleted'
    }
  }
}
