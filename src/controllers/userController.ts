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