import { Router } from "express";

import UserControler from "./controllers/UserControler.js";
import CardControler from "./controllers/CardControler.js";
import CardChecker from "./controllers/CardChecker";
import CardHistory from "./controllers/CardHistory.js";
const router = Router();
// rotas para criacao e edicao do ususario
router.post("/user", UserControler.newUser);
router.get("/users", UserControler.findAllUser);
router.get("/users/id/:id", UserControler.findUser_id);
router.get("/users/role/:role", UserControler.findUser_role);
router.put("/users/:id", UserControler.updateUser);
router.delete("/users/:id", UserControler.deleteUser);
// rotas para criaçao e edicao dos cartoes
router.post("/card/user/:id", CardControler.newCard)
router.get("/cards", CardControler.findAllCards);
router.get("/card/id/:id", CardControler.findCard_id);
router.get("/card/perm/:perm", CardControler.findCard_perm);
router.put("/cards/:id", CardControler.updateCard);
router.delete("/cards/:id", CardControler.deleteCard);
//rota de verificaçao das tags 
router.get("/tagcheck/:tag", CardChecker.Check);
// rotas do historico de tags
router.get("/taghistory",CardHistory.LastCards)
export { router };
