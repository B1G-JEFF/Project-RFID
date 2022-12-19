import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  async newUser(req, res) {
    try {
      let { name, email } = req.body;

      let user = await prisma.users.findUnique({ where: { email } });

      if (user) {
        return res.json({ error: "invalid email" });
      }
      name = name.toLowerCase()
      user = await prisma.users.create({
        data: { name, email },
      });
      res.json(user);
    } catch (error) {
      return res.json({ error });
    }
  },

  async findAllUser(req, res) {
    try {
      const users = await prisma.users.findMany();
      return res.json(users);
    } catch (error) {
      return res.json({ error });
    }
  },
  async findUser(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.users.findUnique({ where: { id: Number(id) } });

      if (!user) return res.json({ error: "User not found" });

      return res.json(user);
    } catch (error) {
      return res.json({ error });
    }
  },
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      let user = await prisma.users.findUnique({ where: { id: Number(id) } });
      if (!user) return res.json({ error: "User not found" });

      user = await prisma.users.update({
        where: { id: Number(id) },
        data: { name, email },
      });
      return res.json({ user });
    } catch (error) {
      return res.json({ error });
    }
  },


  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await prisma.users.findUnique({ where: { id: Number(id) } });

      if (!user) return res.json({ error: "User not found" });

      await prisma.users.delete({ where: { id: Number(id) } });
      return res.json({ mensage: "User deleted" });
    } catch (error) {
      return res.json({error});
    }
  },
};
