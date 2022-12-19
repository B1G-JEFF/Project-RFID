import { Router } from "express";

import UserControler from "./controllers/UserControler.js";
import CardControler from "./controllers/CardControler.js";

const router = Router();
// rotas para criacao e edicao do ususario
router.post("/user", UserControler.newUser);
router.get("/users", UserControler.findAllUser);
router.get("/users/:id", UserControler.findUser);
router.put("/users/:id", UserControler.updateUser); 
router.delete("/users/:id", UserControler.deleteUser);
// rotas para criaçao e edicao dos cartoes
router.post("/card/user/:id", CardControler.newCard)
router.get("/cards", CardControler.findAllCards);
router.get("/card/:id", CardControler.findCard);
router.put("/cards/:id", CardControler.updateCard);
router.delete("/cards/:id", CardControler.deleteCard);

export { router };
