import type { Core } from "@strapi/strapi";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx) {
    const userId = ctx.state.user?.id;
    if (!userId) {
      return ctx.unauthorized("You must be logged in");
    }

    const orders = await strapi.entityService.findMany("api::order.order", {
      filters: {
        $and: [{ userId: { $eq: String(userId) } }],
      },
      sort: { createdAt: "desc" },
    });

    return { data: orders };
  },

  async findOne(ctx) {
    const userId = ctx.state.user?.id;
    const { id } = ctx.params;

    if (!userId) {
      return ctx.unauthorized("You must be logged in");
    }

    const order = await strapi.entityService.findOne("api::order.order", id);

    if (!order || order.userId !== String(userId)) {
      return ctx.notFound("Order not found");
    }

    return { data: order };
  },

  async create(ctx) {
    const userId = ctx.state.user?.id;
    if (!userId) {
      return ctx.unauthorized("You must be logged in");
    }

    const orderData = ctx.request.body.data;

    const order = await strapi.entityService.create("api::order.order", {
      data: {
        userId: String(userId),
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...orderData,
      },
    });

    return order;
  },
});
