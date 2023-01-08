//@ts-check
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default {
    async Check(req, res) {
        try {
            // busca os dados da request
            const { tag } = req.params
            // modelo de tag aceito
            const tagModel = /^([A-F]|[0-9]{2,2})+\s([A-F]|[0-9]{2,2})+\s([A-F]|[0-9]{2,2})+\s([A-F]|[0-9]{2,2})+$/g

            // verifica se o a tag e valida 
            if (!tagModel.test(tag)) {
                if (tag.length != 11) {
                    return res.json({ error: "Tag format is invalid" })
                }
            }
            // verifica se a tag e cadastrada 
            const tagcheck = await prisma.cards.findUnique({ where: { tag: tag } ,select:{id:true}})
            // console.log(tagcheck)
            if (!tagcheck) {
                // se nao ela recebe falso
                var authorized = false
                // adiciona ao historico como nao cadastrada
                const add = await prisma.tagHistory.create({ data: { tag, authorized } })

                return res.json(false)
                
            } else { authorized = true }
                // caso ela seja ela recebe true 
                console.log(Number(tagcheck.id))
                const add = await prisma.tagHistory.create({
                    data: {
                        tag,
                        authorized,
                        user:tagcheck.id 
                    }
                })
                return res.json(true)
            
        } catch (error) {
            console.log(error)
            return res.json({ error })
        }
    }
}