export const route = '/api/list.json';
export const get = async (req, res) => {
  res.json({
    list: [
      {
        id: 1,
        name: 'Item 1',
      },
    ],
  });
};
