import { Request, Response } from 'express';
import Task from '../models/task';
import User from '../models/user';
import { Op } from 'sequelize';

class TaskController {
    // method to create a task
    static async createTask(req: Request, res: Response) {
      try {
        const {
          title,
          description,
          status,
          sector_id,
          company_id,
          assigned_to_id,
        } = req.body;

        // Check if the user is an admin
        const user = await User.findByPk(req.user.id);
        if (!user) {
          res.status(404).json({ error: "user not found" });
          return;
        }

        if (user.role !== "admin") {
          res
            .status(403)
            .json({ error: "Only admins can create tasks" });
          return;
        } 

              // creating a task
              const task = await Task.create({
                title,
                description,
                status,
                sector_id,
                company_id,
                assigned_to_id,
                admin_id: req.user.id,
              });

              res.status(201).json(task);
            } catch (error) {
              console.error(error);
              res.status(500).json({ error: "error creating task" });
            }
          }