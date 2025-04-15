import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Company from '../models/company';
import Sector from '../models/sector';

class UserController {
    static async register(req: Request, res: Response) {
      try {
        const { name, email, password, sector_name, company_name } = req.body;
  
        const [company, companyCreated] = await Company.findOrCreate({
          where: { name: company_name },
        });
  
        if (!company) {
          res.status(400).json({ error: "Falha ao encontrar empresa" });
          return;
        }

        const [sector, sectorCreated] = await Sector.findOrCreate({
            where: { name: sector_name, company_id: company.id },
          });
    
          if (!sectorCreated || !sector) {
            res.status(400).json({ error: "Falha ao criar ou encontrar setor" });
            return;
          }
    
          const user = await User.create({
            name,
            email,
            password: password,
            role: "admin",
            sector_id: sector.id,
            company_id: company.id,
          });
    
          res.status(201).json(user.createdAt);
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: "Erro ao cadastrar usuário" });
        }
      }