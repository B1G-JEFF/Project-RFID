import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default {
  // cria um novo user 
  async newUser(req, res) {
    try {
      // busca os dados da request 
      let { name, email, role } = req.body;
      // verifica se o e-mail existe
      let user = await prisma.users.findUnique({ where: { email } });
      if (user) {
        return res.json({ error: "invalid email" });
      }
      // verifica se o cargo e valido
      if (role == 'student' || role == 'teacher' || role == 'adm') {
        // deixa o nome minusculo 
        name = name.toLowerCase()
        // cria o user 
        user = await prisma.users.create({
          data: { name, email, role },
        });

        res.json(user);
      } else { return res.json({ error: "invalid role" }) }

    } catch (error) {
      return res.json({ error });
    }
  },
  // busca todos os usuarios
  async findAllUser(req, res) {
    try {
      // busca todos os usuarios 
        const users = await prisma.users.findMany();
      return res.json(users);
    } catch (error) {
      return res.json({ error });
    }
  },
  // busca usuario por id
  async findUser_id(req, res) {
    try {
      // busca os dados da request 
      const { id } = req.params;
      // busca o usuario
      const user = await prisma.users.findUnique({ where: { id: Number(id) } });
      // verifica se ele existe
      if (!user) return res.json({ error: "User not found" });

      return res.json(user);
    } catch (error) {
      return res.json({ error });
    }
  },
  //  resolver essa parada de verificar o role
  async findUser_role(req, res) {
    try {
      // pega os dados da request 
      const { role } = req.params
      // verifica se os o dado e valido 
      if (role == "adm" || role == "teacher" || role == "student") {
        const users = await prisma.users.findMany({ where: { role: role } })
        return res.json(users)
      } else {
        // retorna um erro caso nao seja
        return res.json({ error: "role invalid" })
      }

    } catch (error) {
      return res.json({ error })
    }
  },

  async updateUser(req, res) {
    try {
      // pega os dados da request 
      const { id } = req.params;
      const { name, email, role } = req.body;
      // verifica se o user existe
      let user = await prisma.users.findUnique({ where: { id: Number(id) } });
      if (!user) return res.json({ error: "User not found" });
      // verifica se o email ja e cadastrado
      user = await prisma.users.findUnique({ where: { email } });
      if (user) {
        return res.json({ error: "invalid email" });
      }
      // verica se o cargo e valido
      if (role == 'student' | 'teacher' | 'adm') {
        // atualiza o user 
        user = await prisma.users.update({
          where: { id: Number(id) },
          data: { name, email, role },
        });
        return res.json({ user });
      } else {
        return res.json({ error: "invalid role" })
      }

    } catch (error) {
      return res.json({ error });
    }
  },

  async deleteUser(req, res) {
    try {
      // busca os dados da request 
      const { id } = req.params;
      // verifica se o user existe 
      const user = await prisma.users.findUnique({ where: { id: Number(id) }, include: { Cards: true } });
      if (!user) return res.json({ error: "User not found" });
     
      // verifica se o usuario tem um cartao cadastrado  
      if (!user.Cards) {
        // deleta o user direto 
         const del = await prisma.users.delete({where:{id:Number(id)}})
        return res.json({mensage:"user deleted"})
      }else{
        // deleta o cartao de pois o user 
        const delCard= await prisma.cards.delete({where:{id:user.Cards.id}})
        const del = await prisma.users.delete({where:{id:Number(id)}})
        return res.json({mensage:"user and card deleted"})
      }

    } catch (error) {
      return res.json({ error });
    }
  },
};
