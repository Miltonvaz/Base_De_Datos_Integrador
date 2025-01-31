import { UserRepository } from "../repositories/UserRepository";
import { User } from "../models/User";
import { DateUtils } from "../../shared/utils/DateUtils"; 
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.SECRET || "";
const saltRounds = 10;

export class userService {

    public static async login(name: string, password: string){
        try{
            const user = await this.getUserByName(name);
            if(!user){
                return null;
            }
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return null;
            }

            const payload = {
                user_id: user.user_id,
                role_id_fk: user.role_id_fk,
                name: user.name
            }
            return jwt.sign(payload, secretKey, { expiresIn: '1h' });

        }catch (error: any){
            throw new Error(`Error al logearse: ${error.message}`);
        }

    }

    public static async getAllUser(): Promise<User[]> {
        try {
            return await UserRepository.findAll();
        } catch (error: any) {
            throw new Error(`Error al obtener usuario: ${error.message}`);
        }
    }

    public static async getUserById(userId: number): Promise<User | null> {
        try {
            return await UserRepository.findById(userId);
        } catch (error: any) {
            throw new Error(`Error al encontrar usuario: ${error.message}`);
        }
    }
    public static async getUserByName(name: string): Promise<User | null> {
        try{
            return await UserRepository.findByName(name);
        }catch (error: any){
            throw new Error(`Error al encontrar empleado: ${error.message}`);
        }
    }

    public static async addUser(user: User) {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            user.created_at = DateUtils.formatDate(new Date()); 
            user.updated_at = DateUtils.formatDate(new Date()); 
            user.password = await bcrypt.hash(user.password, salt);
            return await UserRepository.createUser(user);
        } catch (error: any) {
            throw new Error(`Error al crear ususario: ${error.message}`);
        }
    }

    public static async modifyUser(userId: number, userData: User) {
        try {
            const userFinded = await UserRepository.findById(userId);
            const salt = await bcrypt.genSalt(saltRounds);
            if (userFinded) {
                if (userData.name) {
                    userFinded.name = userData.name;
                }
                if(userData.password){
                    userFinded.password = await bcrypt.hash(userData.password, salt);
                }
                if (userData.role_id_fk) {
                    userFinded.role_id_fk = userData.role_id_fk;
                }
                if (userData.deleted !== undefined) {
                    userFinded.deleted = userData.deleted;
                }
            } else {
                return null;
            }
            userFinded.updated_at = DateUtils.formatDate(new Date());
            return await UserRepository.updateUser(userId, userFinded);
        } catch (error: any) {
            throw new Error(`Error al modificar usuario: ${error.message}`);
        }
    }

    public static async deletedUser(userId: number): Promise<boolean> {
        try {
            return await UserRepository.deleteUser(userId);
        } catch (error: any) {
            throw new Error(`Error al eliminar usuario: ${error.message}`);
        }
    }
    public static async deleteUserLogic(userId: number): Promise<boolean> {
        try {
            return await UserRepository.deleteLogic(userId);
        } catch (error: any) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }
}
