import type { Core } from "@strapi/strapi";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx) {
    const userId = ctx.state.user?.id;
    if (!userId) {
      return ctx.unauthorized("You must be logged in");
    }

    const wishlists = await strapi.entityService.findMany(
      "api::wishlist.wishlist",
      {
        filters: {
          $and: [{ userId: { $eq: String(userId) } }],
        },
        sort: { addedAt: "desc" },
      },
    );

    return wishlists;
  },

  async create(ctx) {
    const userId = ctx.state.user?.id;
    if (!userId) {
      return ctx.unauthorized("You must be logged in");
    }

    const { shoe, shoeName, shoeImage, shoePrice } = ctx.request.body.data;

    const existing = await strapi.entityService.findMany(
      "api::wishlist.wishlist",
      {
        filters: {
          $and: [{ userId: { $eq: String(userId) } }, { shoe: { $eq: shoe } }],
        },
      },
    );

    if (existing.length > 0) {
      return ctx.badRequest("Item already in wishlist");
    }

    const wishlist = await strapi.entityService.create(
      "api::wishlist.wishlist",
      {
        data: {
          userId: String(userId),
          shoe,
          shoeName,
          shoeImage,
          shoePrice,
          addedAt: new Date(),
        },
      },
    );

    return wishlist;
  },

  async delete(ctx) {
    const userId = ctx.state.user?.id;
    const { id } = ctx.params;

    if (!userId) {
      return ctx.unauthorized("You must be logged in");
    }

    const wishlist = await strapi.entityService.findOne(
      "api::wishlist.wishlist",
      id,
    );

    if (!wishlist || wishlist.userId !== String(userId)) {
      return ctx.notFound("Wishlist item not found");
    }

    await strapi.entityService.delete("api::wishlist.wishlist", id);

    return { success: true };
  },
});
