import { UserRole } from '../config/role';

export default {
  '/api/auth_routes': {
    '/form/advanced-form': { authority: [UserRole.admin, UserRole.user] },
  },
};
