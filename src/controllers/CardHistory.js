// @ts-check
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default {
    async LastCards(req, res) {

        const rowcount = await prisma.tagHistory.count()

        const lastag = await prisma.tagHistory.findUnique({
            where: { id: rowcount },
            include: { card: true }
        })
        if(!lastag)return res.json("batata")
        console.log(lastag.card)
        const last = await prisma.users.findUnique({where:{id: lastag.card.id}})
        console.log(last)
    },
}