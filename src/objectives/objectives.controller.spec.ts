import { Test, TestingModule } from '@nestjs/testing';
import { ObjectivesController } from './objectives.controller';
import { ObjectivesService } from './objectives.service';

describe('ObjectivesController', () => {
  let controller: ObjectivesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjectivesController],
      providers: [ObjectivesService],
    }).compile();

    controller = module.get<ObjectivesController>(ObjectivesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
