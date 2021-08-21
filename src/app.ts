import * as express from "express";
import {Request, Response} from "express";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import { sign } from 'jsonwebtoken';
import authConfig from './authConfig';
import ensureAuthenticated from './ensureAuthenticated';

const {secret, expiresIn} = authConfig.jwt;
// const secret = "rotico-admin-ale";
// const expiresIn = "365d";

// create typeorm connection
createConnection().then(connection => {
    const userRepository = connection.getRepository(User);

    // create and setup express app
    const app = express();
    app.use(express.json());

    // register routes

    app.get("/ok", async function(req: Request, res: Response) {
        res.json({ok:"ok"});
    });

    app.get("/addrops", async function(req: Request, res: Response) {
        res.json({ok:"addrops"});
    });

    app.post("/session", async function(req: Request, res: Response) {
        const { email, password } = req.body;
        // const email = "a";
        const user = await userRepository.findOne({where:{email: email}});

        if(!user) {
            return res.json({msg:"Credenciais erradas"});
        }

        if(password != user.password) {
            return res.json({msg:"Credenciais erradas"});
        }

        const token = sign({}, secret , {
            subject: user.id.toString(),
            expiresIn: expiresIn
        });

        return res.json({
            user,
            token
        })

    });

    app.get("/users", async function(req: Request, res: Response) {
        const users = await userRepository.find();
        res.json(users);
    });

    app.get("/users/:id", async function(req: Request, res: Response) {
        const results = await userRepository.findOne(req.params.id);
        return res.send(results);
    });

    app.post("/users", async function(req: Request, res: Response) {
        const user = await userRepository.create(req.body);
        const results = await userRepository.save(user);
        return res.send(results);
    });

    app.put("/users/:id", async function(req: Request, res: Response) {
        const user = await userRepository.findOne(req.params.id);
        userRepository.merge(user, req.body);
        const results = await userRepository.save(user);
        return res.send(results);
    });

    app.delete("/users/:id", async function(req: Request, res: Response) {
        const results = await userRepository.delete(req.params.id);
        return res.send(results);
    });

    // start express server
    app.listen(3000);
});