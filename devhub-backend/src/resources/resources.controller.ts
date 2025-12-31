import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResourcesService } from './resources.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateResourceDto } from './dto/create-resource.dto';
import type { JwtUserPayload } from 'src/common/decorators/current-user.decorator';
import { ok, fail } from 'src/common/api-response';
import { CreateFromUrlDto } from './dto/create-from-url.dto';

@Controller('resources')
@UseGuards(AuthGuard('jwt'))
export class ResourcesController {
  constructor(private readonly resourceService: ResourcesService) {}

  @Post()
  async create(
    @CurrentUser() user: JwtUserPayload,
    @Body() createResourceDto: CreateResourceDto,
  ) {
    const resource = await this.resourceService.createForUser(
      user.sub,
      createResourceDto,
    );
    return ok(resource);
  }

  @Get()
  async findBySpace(
    @CurrentUser() user: JwtUserPayload,
    @Query('spaceId') spaceId?: string,
  ) {
    if (!spaceId) {
      return fail('spaceId query parameter is required', 'BAD_REQUEST');
    }
    const resources = await this.resourceService.findBySpaceForUser(
      user.sub,
      spaceId,
    );
    return ok(resources);
  }
  @Post('from-url')
  async createFromUrl(
    @CurrentUser() user: JwtUserPayload,
    @Body() dto: CreateFromUrlDto,
  ) {
    try {
      const resource = await this.resourceService.createFromUrl(user.sub, dto);
      return ok(resource);
    } catch (error) {
      return fail(error.message, 'SCRAPE_FAILED');
    }
  }
}
