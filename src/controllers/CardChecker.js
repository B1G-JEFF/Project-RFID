// @ts-check
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default {
    async Check(req, res) {
        try {
            // busca os dados da request
            const { tag } = req.params
            // modelo de tag aceito
            const tagModel = /^([A-F]|[0-9]{2,2})+\s([A-F]|[0-9]{2,2})+\s([A-F]|[0-9]{2,2})+\s([A-F]|[0-9]{2,2})+$/g

            // verufica se o a tag e valida 
            if (!tagModel.test(tag)) {
                if (tag.length != 11) {
                    return res.json({ error: "Tag format is invalid" })
                }
            }
            // verifica se a tag e cadastrada 
            const tagcheck = await prisma.cards.findMany({ where: { tag: tag } })
            console.log(tagcheck)
            if (tagcheck.length < 1) {
                var authorized = Boolean(false)
                const add = await prisma.tagHistory.create({
                    data: {
                        tag,
                        authorized,
                        card: { connect: { id: 0 } }
                    }
                })
                return res.json(false)
            } else { authorized = Boolean(true) }


            const add = await prisma.tagHistory.create({
                data: {
                    tag,
                    authorized,
                    card: { connect: { id: tagcheck[0].id } }
                }
            })
            console.log(add)
            return res.json(true)
        } catch (error) {
            console.log(error)
            return res.json({ error })
        }
    }
}