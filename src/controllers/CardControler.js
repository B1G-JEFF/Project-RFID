import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default {
    async newCard(req, res) {
        const { id } = req.params
        const { tag, perm } = req.body
        try {
            const user = await prisma.users.findUnique({ where: { id: Number(id) } })

            if (!user) {
                return ({ error: "User not foud" })
            }

            console.log(id, "\n", tag, "\n", perm)

            const createCard = await prisma.cards.create({
                data: {
                    tag,
                    Users: { connect: { id: user.id } }
                },
            })
            return res.json(createCard)
        } catch (error) {
            return res.json({ error })
        }
    },

    async findAllCards(req, res) {
        try {
            const cards = await prisma.cards.findMany()
            return res.json(cards)
        } catch (error) {
            return res.json({ error })
        }

    },
    async findCard(req, res) {
        try {
            const { id } = req.params
            const user = await prisma.cards.findUnique({ where: { id: Number(id) } })

            if (!user) return res.json({ error: "Card not found" })

            return res.json(user)
        } catch (error) {
            return res.json({ error })
        }
    },
    async updateCard(req, res) {
        try {
            const { id } = req.params
            const { tag, perm } = req.body

            let card = await prisma.cards.findUnique({ where: { id: Number(id) } })
            if (!card) return res.json({ error: "Card not found" })

            card = await prisma.cards.update({ where: { id: Number(id) }, data: { tag, perm } })

            return res.json({ card })
        } catch (error) {
            return res.json({ error })
        }
    },
    async deleteCard(req, res) {
        try {
            const { id } = req.params
            const card = await prisma.cards.findUnique({ where: { id: Number(id) } })

            if (!card) return res.json({ error: "Card not found" })

             await prisma.cards.delete({where:{id: Number(id)}})
             return res.json({mensage:"Card deleted"})
        } catch (error) {
            return res.json({ error })
        }
    }
}