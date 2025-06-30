import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../lib/api';
import { StreamChat } from 'stream-chat';

const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);

const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutate: logoutMutation, isPending, error } = useMutation({
    mutationFn: async () => {
      if (client.userID) {
        await client.disconnectUser();
      }
      await logout();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });

  return { logoutMutation, isPending, error };
};

export default useLogout;
