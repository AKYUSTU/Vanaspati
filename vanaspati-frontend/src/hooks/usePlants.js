import { useQuery } from '@tanstack/react-query';
import { getPlants } from '../api/plants';

export const usePlants = (filters = {}) =>
  useQuery({
    queryKey: ['plants', filters],
    queryFn: () => getPlants(filters),
    placeholderData: (previousData) => previousData,
  });
