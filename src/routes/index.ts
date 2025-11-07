import { lazy } from 'react';
import ListUsers from '../pages/Users/List';
import CreateUser from '../pages/Users/Create';
import UpdateUser from '../pages/Users/Update';
import ListRoles from '../pages/Roles/list2';
import ListPermissions from '../pages/Permissions/List';
import ProfilePage from '../pages/Profile/ProfilePage';
import ListRolePermissions from '../pages/RolePermissions/ListRolePermissions';
import UpdateProfilePage from '../pages/Profile/UpdateProfilePage';
import RolePermissionPage from '../pages/RolePermissions/AddPermissionToRole';
import AddPermissionToRole from '../pages/RolePermissions/AddPermissionToRole';

const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));
const Demo = lazy(() => import('../pages/Demo'));

const coreRoutes = [
  {
    path: "/role-permissions",
    title: "List Role Permissions",
    component: ListRolePermissions,
  },
  {
    path: "/role-permissions/create",
    title: "Assign Role Permission",
    component: AddPermissionToRole,
  },

  {
    path: '/api/profile',
    title: 'Profile',
    component: ProfilePage,
  },
  {
    path: '/api/profiles/:id',
    title: 'Update Profile',
    component: UpdateProfilePage,
  },
  {
    path: '/api/roles',
    title: 'List Roles',
    component: ListRoles,
  },
  {
    path: '/api/permissions',
    title: 'List Permissions',
    component: ListPermissions,
  },
  {
    path: '/demo',
    title: 'Demo',
    component: Demo,
  },
  {
    path: '/users/create',
    title: 'Create Users',
    component: CreateUser,
  },
  {
    path: '/users/update/:id',
    title: 'Update Users',
    component: UpdateUser,
  },
  {
    path: '/api/users',
    title: 'List Users',
    component: ListUsers,
  },
  {
    path: '/calendar',
    title: 'Calendar',
    component: Calendar,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
  },
  {
    path: '/tables',
    title: 'Tables',
    component: Tables,
  },
  {
    path: '/settings',
    title: 'Settings',
    component: Settings,
  },
  {
    path: '/chart',
    title: 'Chart',
    component: Chart,
  },
  {
    path: '/ui/alerts',
    title: 'Alerts',
    component: Alerts,
  },
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Buttons,
  },
];

const routes = [...coreRoutes];
export default routes;
