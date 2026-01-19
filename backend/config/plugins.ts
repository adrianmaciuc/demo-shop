export default ({ env }) => ({
  "users-permissions": {
    config: {
      ratelimit: {
        enabled: true,
        interval: { min: 5 },
        max: 5,
      },
    },
  },
});
