import { Module } from '@nestjs/common';
import { ProjectsService } from './project.service';
import { ProjectsResolver } from './project.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  providers: [ProjectsResolver, ProjectsService],
})
export class ProjectModule {}
