import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    createUser: jest.fn(),
    getUserFromApi: jest.fn(),
    getUserAvatar: jest.fn(),
    deleteUserAvatar: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('createUser', () => {
    it('should call userService.createUser and return the result', async () => {
      const createUserDto = { email: 'test@example.com' };
      const result = { id: '1', ...createUserDto };

      mockUserService.createUser.mockResolvedValue(result);

      expect(await userController.createUser(createUserDto)).toBe(result);
      expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getUser', () => {
    it('should call userService.getUserFromApi and return the result', async () => {
      const userId = '1';
      const result = { id: userId, email: 'test@example.com' };

      mockUserService.getUserFromApi.mockResolvedValue(result);

      expect(await userController.getUser(userId)).toBe(result);
      expect(mockUserService.getUserFromApi).toHaveBeenCalledWith(userId);
    });
  });

  describe('getUserAvatar', () => {
    it('should call userService.getUserAvatar and return the result', async () => {
      const userId = '1';
      const result = 'base64encodedstring';

      mockUserService.getUserAvatar.mockResolvedValue(result);

      expect(await userController.getUserAvatar(userId)).toBe(result);
      expect(mockUserService.getUserAvatar).toHaveBeenCalledWith(userId);
    });
  });

  describe('deleteUserAvatar', () => {
    it('should call userService.deleteUserAvatar and return the result', async () => {
      const userId = '1';
      const result = 'Deleted successfully!';

      mockUserService.deleteUserAvatar.mockResolvedValue(result);

      expect(await userController.deleteUserAvatar(userId)).toBe(result);
      expect(mockUserService.deleteUserAvatar).toHaveBeenCalledWith(userId);
    });
  });
});
