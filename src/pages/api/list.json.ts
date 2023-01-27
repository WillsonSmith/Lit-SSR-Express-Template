export const route = '/api/list.json';
export const get = async (_, res) => {
  res.json({
    list: [
      {
        id: 1,
        name: 'Item 1',
      },
    ],
  });
};
