//@ts-check
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// regex com o formato de tag aceito : hexadecimal , 
// padrao : |A1 A1 A1 A1| quatro pares e 1 espaço entre eles  
const tagModel =
    /^([A-F]|[0-9]{2,2})+\s([A-F]|[0-9]{2,2})+\s([A-F]|[0-9]{2,2})+\s([A-F]|[0-9]{2,2})+$/g

export default {
    // cria um novo cartao 
    async newCard(req, res) {
        try {

            // pega as os dados da request 
            const { id } = req.params
            const { tag, perm } = req.body

            //busca os dados do user e da tag passada pela request 
            const user = await prisma.users.findUnique({
                where: { id: Number(id) },
                include: { Cards: true }
            })
            const card = await prisma.cards.findMany({ where: { tag: tag } })

            // verifica se o user do id da request existe  
            if (!user) return res.json({ error: "User not found" })
            // verifica se a cartao ja existe 
            if (card.length != 0) return res.json({ error: "Tag already registered" })
            // verifica se o user ja tem um cartao
            if (user.Cards != null) return res.json({ error: "User already has a Card" })
            //verifica o formato da tag
            if (!tagModel.test(tag)) {
                if (tag.length != 11) { return res.json({ error: "Tag format is invalid" }) }
            }

            //cria o cartao e vincula ele a um user 
            // um cartao so pode existir vinculado a um user 
            const add = await prisma.cards.create({
                data:
                {
                    tag, perm,
                    user: { connect: { id: user.id } }
                }
            })
            return res.json({ add })

        } catch (error) {
            console.log({ error })
            return res.json({ error })
        }


    },
    // busca todos os cartoes 
    async findAllCards(req, res) {
        try {
            // busca todos os user
            const cards = await prisma.cards.findMany()
            return res.json(cards)
        } catch (error) {
            return res.json({ error })
        }

    },
    // busca um cartao pelo id
    async findCard_id(req, res) {
        try {
            // pega os dados da request 
            const { id } = req.params
            // procura o cartao de acordo com o id dele 
            const card = await prisma.cards.findUnique({ where: { id: Number(id) } })
            // retorna um erro caso nao seja encontrado o cartao 
            if (!card) return res.json({ error: "Card not found" })

            return res.json(card)
        } catch (error) {
            return res.json({ error })
        }
    },
    // busca todos os cartoes que tem a permisao
    async findCard_perm(req, res) {
        try {
            // pega os dados da request 
            const { perm } = req.params
            // busca todos os cartoes com aquela permisao
            const card = await prisma.cards.findMany({ where: { perm: Number(perm) } })
            // verifica se ele encontrou algum cartao com aquela perm 
            if (card.length < 1) return res.json({ error: "Card not found" })
            return res.json(card)
        } catch (error) {
            console.log({ error })
            return res.send({ error })
        }
    },
    // atualiza o cartao 
    async updateCard(req, res) {
        try {
            // busca os dados da request 
            const { id } = req.params
            const { tag, perm } = req.body
            // verifica se o cartao existe 
            let card = await prisma.cards.findUnique({ where: { id: Number(id) } })
            if (!card) return res.json({ error: "Card not found" })
            // verifica o se o formato da tag e valido
            if (!tagModel.test(tag)) {
                if (tag.length != 11) { return res.json({ error: "Tag format is invalid" }) }
            }
            //verifica se a tag ja e cadastrada 
            card = await prisma.cards.findUnique({ where: { tag: tag } })
            if (card) res.json({ error: "Tag already registered" })
            // atualiza o cartao 
            card = await prisma.cards.update({ where: { id: Number(id) }, data: { tag, perm } })

            return res.json({ card })
        } catch (error) {
            return res.json({ error })
        }
    },

    // e imposivel deletar um cartao vinculado a um user e e imposivel ter um cartao sem um user
    // trabalhar nisso 
    async deleteCard(req, res) {
        try {
            const { id } = req.params
            const card = await prisma.cards.findUnique({ where: { id: Number(id) } })

            if (!card) return res.json({ error: "Card not found" })

            await prisma.cards.delete({ where: { id: Number(id) } })
            return res.json({ mensage: "Card deleted" })
        } catch (error) {
            console.log(error)
            return res.json({ error })
        }
    }
}