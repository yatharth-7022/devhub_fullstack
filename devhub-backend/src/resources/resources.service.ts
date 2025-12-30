import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SpacesService } from 'src/spaces/spaces.service';
import { CreateResourceDto } from './dto/create-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly spacesService: SpacesService,
  ) {}

  async createForUser(userId: string, dto: CreateResourceDto) {
    // Ensure the space belongs to the user
    await this.spacesService.ensureUserOwnsSpace(userId, dto.spaceId);
    const resource = await this.prisma.resource.create({
      data: {
        spaceId: dto.spaceId,
        title: dto.title,
        url: dto.url,
        contentPreview: dto.contentPreview,
        tags: dto.tags,
      },
    });
    return resource;
  }
  async findBySpaceForUser(userId: string, spaceId: string) {
    // Ensure the space belongs to the user
    await this.spacesService.ensureUserOwnsSpace(userId, spaceId);
    const resources = await this.prisma.resource.findMany({
      where: {
        spaceId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return resources;
  }
}
