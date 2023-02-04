import prisma from '../../../db/client.js';
export const route = '/admin/users/new';
export const get = async (req, res) => {
  const roles = await prisma.role.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  res.render('admin/users/userEdit', {
    user: {
      id: null,
      name: '',
      role: {
        id: null,
        name: '',
      },
    },
    roles,
    action: req.path,
  });
};

export const post = async (req, res) => {
  const { name, role } = req.body;
  await prisma.user.create({
    data: {
      name,
      role: {
        connect: {
          id: parseInt(role),
        },
      },
    },
  });
  res.redirect('/admin/users');
};
