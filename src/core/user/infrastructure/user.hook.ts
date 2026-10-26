import { useQuery } from '@tanstack/react-query';
import { UserController } from '@core/user/domain/user.controller';
import { UserRequest } from '@core/user/domain/user.interface';

const userController = new UserController();

export const useGetDetailUser = (params: UserRequest.getDetailUser) => {
  return useQuery({
    queryKey: ['user', params],
    queryFn: () => userController.getDetailUser(params),
    enabled: !!params?.id,
  });
};
