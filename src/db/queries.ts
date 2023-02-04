const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
export const whereCreatedFiveMinutesAgo = {
  where: {
    createdAt: {
      lte: fiveMinutesAgo,
    },
  },
};
