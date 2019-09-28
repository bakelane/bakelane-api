import { findAll, create } from "./ordersController";
import { requireAuthentication } from "../auth/authMiddleware";

async function routes(fastify) {
  fastify.route({
    method: "POST",
    url: "/orders/new",
    schema: {
      headers: {
        type: "object",
        properties: {
          authorization: { type: "string" }
        },
        required: ["authorization"]
      },
      body: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: {
            type: "string"
          }
        },
        required: ["title", "description"]
      }
    },
    preHandler: function(request, reply, done) {
      const userId = requireAuthentication(request.headers);

      request.userId = userId;
      done();
    },
    handler: async function(request, reply) {
      const data = await create(request.body, request.userId);

      reply.send(data);
    }
  }),
    fastify.route({
      method: "GET",
      url: "/orders",
      handler: async function(request, reply) {
        const data = await findAll();

        reply.send(data);
      }
    });
}

export default routes;
