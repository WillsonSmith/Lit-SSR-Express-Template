export const route = '/logout';
export const get = async (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

export const post = async (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
