import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    public project: Model<Project>,
  ) {}

  async create(userData: CreateProjectInput): Promise<Project> {
    try {
      const userDataNew = await this.project.create({
        ...userData,
      } as any);

      if (userDataNew) {
        return userDataNew;
      }
    } catch (err) {
      return err;
    }
  }

  async findAll(): Promise<Project[]> {
    const data = await this.project.find();
    return data;
  }

  async findOne(userId: string): Promise<Project[]> {
    try {
      return await this.project.find({
        userId: userId,
      });
    } catch (err) {
      return err;
    }
  }

  async update(
    id: string,
    updateProject: UpdateProjectInput,
  ): Promise<Project> {
    try {
      return await this.project.findOneAndUpdate(
        { id },
        { ...updateProject },
        { new: true },
      );
    } catch (err) {
      return err;
    }
  }

  async remove(id: string): Promise<Project> {
    try {
      const user = await this.project.findOneAndDelete({
        id: id,
      });
      return user;
    } catch (err) {
      return err.message;
    }
  }
}
