import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import sequelize from './config/db';
import cors from 'cors';
