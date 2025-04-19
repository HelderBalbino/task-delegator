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

            // list all tasks and paginate
            static async getTasksByPage(req: Request, res: Response) {
                try {
                  const { page } = req.params;
                  const userId = req.user.id;
                  const pageSize = 15; // Number of tasks per page
                  const offset = (parseInt(page) - 1) * pageSize;
    
                  const tasks = await Task.findAll({
                    where: {
                      [Op.or]: [
                        { assigned_to_id: userId }, // the task can be assigned to the user
                        { admin_id: userId }, // or the task can be created by the user
                      ],
                    },
                    limit: pageSize,
                    offset: offset,
                    include: [
                      {
                        model: User,
                        as: "assignedUser",
                        attributes: ["id", "name", "email"],
                      }, 
                    ],
                    attributes: ["id", "title", "description", "status", "sector_id"],
                  });
    
                  res.status(200).json(tasks);
                } catch (error) {
                  console.error(error);
                  res.status(500).json({ error: "Error fetching tasks" });
                }
              }

              static async inProgressTask(req: Request, res: Response) {
                try {
                  const { id } = req.params; 
                  const userId = req.user.id;
    
                  // search for the task by id
                  const task = await Task.findByPk(id);
                  if (!task) {
                    res.status(404).json({ error: "Task not found" });
                    return;
                  }
                  if (task.assigned_to_id !== userId) {
                    res
                      .status(403)
                      .json({ error: "only the user assigned to the task can update it" });
                    return;
                  }
    
                  //update the task status to "in_progress"
                  // and save it to the database
                  task.status = "in_progress"; 
                  await task.save(); // save the task to the database
    
                  res.status(200).json({ message: "Task in progress", task });
                } catch (error) {
                  console.error(error);
                  res.status(500).json({ error: "Error updating task status" });
                }
              }