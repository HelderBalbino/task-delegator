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

      static async registerDependent(req: Request, res: Response) {
        try {
          const { name, email, password } = req.body;
    
          const userId = req.user.id; // O ID do admin que está criando o dependente
    
          // Verificando se o usuário que está criando o dependente é um admin
          const adminUser = await User.findByPk(userId, {
            include: [
              { model: Company, as: "company" },
              { model: Sector, as: "sector" },
            ],
          });
    
          if (!adminUser || adminUser.role !== "admin") {
            res.status(403).json({
              error: "Apenas administradores podem cadastrar dependentes.",
            });
            return;
          }

            // Criando o dependente (usuário subordinado)
            const dependent = await User.create({
                name,
                email,
                password: password,
                role: "user", // Dependentes terão o papel de "user"
                sector_id: adminUser.sector_id,
                company_id: adminUser.company_id,
                primary_user_id: adminUser.id, // Associa o dependente ao usuário principal (admin)
              });
        
              res.status(201).json(dependent);
            } catch (error) {
              console.error(error);
              res.status(500).json({ error: "Erro ao cadastrar dependente" });
            }
          }

          static async login(req: Request, res: Response) {
            try {
              const { email, password } = req.body;
              const user = await User.findOne({
                where: { email },
                include: [
                  { model: Company, as: "company" },
                  { model: Sector, as: "sector" },
                ],
              });
        
              if (!user) {
                res.status(401).json({ error: "Credenciais inválidas" });
                return;
              }
        
              const validPassword = await bcrypt.compare(password, user.password);
              console.log(validPassword);
        
              if (!validPassword) {
                res.status(401).json({ error: "Credenciais inválidas" });
                return;
              }

              const companyName = user.company?.name; // Acessando o nome da empresa
              const sectorName = user.sector?.name; // Acessando o nome do setor
        
              const token = jwt.sign(
                {
                  id: user.id,
                  role: user.role,
                  userParent: user.primary_user_id,
                },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: "1h" }
              );
        
              res.status(200).json({
                token,
                name: user.name,
                role: user.role,
                company: companyName,
                sector: sectorName,
              });
            } catch (error) {
              console.error(error);
        
              res.status(500).json({ error: "Erro ao realizar login" });
            }
          }

          static async getAllUsersByAdmin(req: Request, res: Response) {
            try {
              const userId = req.user.id;
        
              // Verificando se o usuário logado é um administrador
              const adminUser = await User.findByPk(userId);
        
              if (!adminUser || adminUser.role !== "admin") {
                return res.status(403).json({
                  error: "Somente administradores podem visualizar seus dependentes.",
                });
              }
        
              // Buscando todos os dependentes (usuários com primary_user_id igual ao adminId)
              const dependents = await User.findAll({
                where: {
                  primary_user_id: adminUser.id,
                },
                attributes: ["id", "name"], // Selecionando apenas os campos necessários
              });
        
              // Caso não existam dependentes
              if (dependents.length === 0) {
                return res
                  .status(404)
                  .json({ message: "Nenhum dependente encontrado" });
              }
        
              res.status(200).json(dependents);
            } catch (error) {
              console.error(error);
              res.status(500).json({ error: "Erro ao buscar dependentes" });
            }
          }

          static async getUserById(req: Request, res: Response) {
            try {
              const { id } = req.params;
              const userId = req.user.id;
              const user = await User.findByPk(id);
        
              if (!user) {
                res.status(404).json({ error: "Usuário não encontrado" });
                return;
              }
        
              if (user.primary_user_id !== userId && user.id !== userId) {
                res.status(403).json({
                  error:
                    "Usuário sem permissão para visualizar o perfil de outro usuário.",
                });
                return;
              }
        
              res.json(user);
            } catch (error) {
              res.status(500).json({ error: "Erro ao buscar usuário" });
            }
          }