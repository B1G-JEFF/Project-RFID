// @ts-check
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default {
    // funcao que busca a ultima tentativa de entrada
    async LastCard(req, res) {
        try {
            // conto as linhas 
            const rowcount = await prisma.tagHistory.count()
            // procuro a ultima tag 
            const lastag = await prisma.tagHistory.findUnique({ where: { id: Number(rowcount) } })
            // verifico se a tag tem um usuario se for = 0 ela nao  tem 
            if (lastag) {
                if (lastag.user == 0) {
                    // ele retorna somente a tag 
                    return res.json({ lastag })
                } else {
                    // busca o cartao da ultima tag 
                    const card = await prisma.cards.findFirst({
                        where: { id: Number(lastag.user) },
                        select: { tag: true, perm: true, usersId: true }
                    })
                    // busca o user da ultima tag 
                    const user = await prisma.users.findFirst({
                        where: { id: Number(card?.usersId) },
                        select: { name: true, role: true }
                    })
                    // retorna o cartao e o user da ultima tag 
                    return res.json({ card, user })
                }
            }

        } catch (error) {

            return res.json({ error })
        }
    },
    // funcao que retorna as ultimas 10 tags lidas 
    async LastCards(req, res) {
        try {
            // conta as linhas 
            let rowcount = await prisma.tagHistory.count()
            // verifica se tem menos de 10 linhas 
            if (rowcount < 10) rowcount = 10

            // busca os ultimos 10 registros 
            var lasttags = []
            for (let i = rowcount - 10; i <= rowcount; i++) {
                let tag = await prisma.tagHistory.findUnique({ where: { id: i } })

                lasttags.push(tag)

            }

            return res.json({ lasttags })
        } catch (error) {
            return res.json({ error })
        }
    },
    // busca a ultima entrada de um usuario especifico 
    async LastentryUser(req, res) {
        try {
            // pego o user da request 
            const { user } = req.params
            // conto as linhas 
            const rowcount = await prisma.tagHistory.count()
            // busco a ultima entrada do usuario 
            for (let i = rowcount; i > 0; i--) {
                let last = await prisma.tagHistory.findUnique({ where: { id: i } })

                if (!last) return res.json({ Error })

                if (last.user == user) {
                    return res.json({ last })
                }
            }
            //  caso nao encontre retorno um erro 
            return res.json({ error: "user not found" })
        } catch (error) {
            return res.json({ error })
        }
    },
    async LastentryCard(req, res) {
        try {
            // busco o cartao da request
            const { card } = req.params
            // conto as linhas 
            const rowcount = await prisma.tagHistory.count()
            // busco os cartao no historico 
            for (let i = rowcount; i > 0; i--) {
                let last = await prisma.tagHistory.findUnique({ where: { id: i } })

                if (!last) return res.json({ Error })

                if (last.tag == card) {
                    return res.json({ last })
                }
            }
            // caso nao encontre ele retorna um error
            return res.json({ error: "tag not found" })

        } catch (error) {
            return res.json({ error })
        }
    }
}