import { lazy } from 'react';
import ListUsers from '../pages/Users/List';
import UpdateUser from '../pages/Users/UpdateUserPage';
import ListRoles from '../pages/Roles/List';
import ListPermissions from '../pages/Permissions/List';
import ProfilePage from '../pages/Profile/ProfilePage';
import ListRolePermissions from '../pages/RolePermissions/ListRolePermissions';
import UpdateProfilePage from '../pages/Profile/UpdateProfilePage';
import AddPermissionToRole from '../pages/RolePermissions/AddPermissionToRole';
import ListSessions from '../pages/Sessions/List';
import ListAddressPage from '../pages/Addresses/ListAddressesPage';
import ListDigitalSignaturesPage from '../pages/DigitalSignatures/ListDigitalSignaturesPage';
import ListPasswordsPage from '../pages/Passwords/ListPasswordsPage';
import ListSecurityQuestionsPage from '../pages/SecurityQuestions/ListSecurityQuestionPage';
import ListAnswersPage from '../pages/Answers/ListAnswersPage';
import ListDevicesPage from '../pages/Devices/ListDevicesPage';
import CreateRolePage from '../pages/Roles/Create';
import AddRoleToUserPage from '../pages/UserRoles/AddRoleToUserPage';
import ListUserRolesPage from '../pages/UserRoles/ListUserRolesPage';
import CreateUser from '../pages/Users/Create';
import UpdateRole from '../pages/Roles/Update';
import CreateDevicePage from '../pages/Devices/CreateDevicesPage';
import UpdateDevicePage from '../pages/Devices/UpdateDevicePage';
import UpdateUserRolePage from '../pages/UserRoles/UpdateUserRolesPage';
import CreateAnswersPage from '../pages/Answers/CreateAnswersPage';
import UpdateAnswersPage from '../pages/Answers/UpdateAnswersPage';
import UpdatePasswordPage from '../pages/Passwords/UpdatePasswordPage';
import CreatePasswordPage from '../pages/Passwords/CreatePasswordPage';
import CreateSecurityQuestionPage from '../pages/SecurityQuestions/CreateSecurityQuestion';
import UpdateSecurityQuestionPage from '../pages/SecurityQuestions/UpdateSecurityQuestion';
import CreateAddressPage from '../pages/Addresses/CreateAddressPage';
import UpdateAddressPage from '../pages/Addresses/UpdateAddressPage';
import CreateSessionPage from '../pages/Sessions/CreateSessionPage';
import UpdateSessionPage from '../pages/Sessions/UpdateSessionPage';
import CreatePermissionPage from '../pages/Permissions/CreatePermissionPage';
import UpdatePermissionPage from '../pages/Permissions/UpdatePermissionPage';
import UpdateDigitalSignaturePage from '../pages/DigitalSignatures/UpdateDigitalSignaturesPage';
import CreateDigitalSignaturePage from '../pages/DigitalSignatures/CreateDigitalSignaturesPage';
import ListProfilesPage from '../pages/Profile/ListProfilesPage';
import CreateProfilePage from '../pages/Profile/CreateProfilePage';
import ViewProfilePage from '../pages/Profile/ViewProfilePage';

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
  // --------------- USER ROUTES ---------------
  {
    path: "/api/users/create",
    title: "Create User",
    component: CreateUser,
  },
  {
    path: '/api/users/:id',
    title: 'Update Users',
    component: UpdateUser,
  },
  {
    path: '/api/users',
    title: 'List Users',
    component: ListUsers,
  },
  // --------------- ROLE ROUTES ---------------
  {
    path: '/api/roles',
    title: 'List Roles',
    component: ListRoles,
  },
  {
    path: "/api/roles/create",
    title: "Create Role",
    component: CreateRolePage,
  },
  {
    path: "/api/roles/:id",
    title: "Update Role",
    component: UpdateRole,
  },
  // --------------- DEVICES ROUTES ---------------
  {
    path: "/api/devices",
    title: "List Devices",
    component: ListDevicesPage,
  },
  {
    path: "/api/devices/create",
    title: "Create Device",
    component: CreateDevicePage,
  },
  {
    path: "/api/devices/:id",
    title: "Update Device",
    component: UpdateDevicePage,
  },
  // --------------- ANSWERS ROUTES ---------------
  {
    path: "/api/answers",
    title: "List Answers",
    component: ListAnswersPage,
  },
  {
    path: "/api/answers/create",
    title: "Create Answer",
    component: CreateAnswersPage,
  },
  {
    path: "/api/answers/:id",
    title: "Update Answer",
    component: UpdateAnswersPage,
  },
  // --------------- SECURITY QUESTIONS ROUTES ---------------
  {
    path: "/api/security-questions",
    title: "List Security Questions",
    component: ListSecurityQuestionsPage,
  },
  {
    path: "/api/security-questions/create",
    title: "Create Security Question",
    component: CreateSecurityQuestionPage
  },
  {
    path: "/api/security-questions/:id",
    title: "Update Security Question",
    component: UpdateSecurityQuestionPage,
  },
  // --------------- PASSWORDS ROUTES ---------------
  {
    path: "/api/passwords",
    title: "List Passwords",
    component: ListPasswordsPage,
  },
  {
    path: "/api/passwords/create",
    title: "Create Password",
    component: CreatePasswordPage,
  },
  {
    path: "/api/passwords/:id",
    title: "Update Password",
    component: UpdatePasswordPage,
  },
  // --------------- DIGITAL SIGNATURES ROUTES ---------------
  {
    path: "/api/digital-signatures",
    title: "List Digital Signatures",
    component: ListDigitalSignaturesPage,
  },
  {
    path: "/api/digital-signatures/create",
    title: "List Digital Signatures",
    component: CreateDigitalSignaturePage,
  },
  {
    path: "/api/digital-signatures/:id",
    title: "List Digital Signatures",
    component: UpdateDigitalSignaturePage,
  },
  // --------------- ADDRESSES ROUTES ---------------
  {
    path: "/api/addresses",
    title: "List Addresses",
    component: ListAddressPage,
  },
  {
    path: "/api/addresses/create",
    title: "List Addresses",
    component: CreateAddressPage,
  },
  {
    path: "/api/addresses/:id",
    title: "List Addresses",
    component: UpdateAddressPage,
  },
  // --------------- SESSIONS ROUTES ---------------
  {
    path: "/api/sessions",
    title: "List Sessions",
    component: ListSessions,
  },
  {
    path: "/api/sessions/create",
    title: "Create Session",
    component: CreateSessionPage,
  },
  {
    path: "/api/sessions/:id",
    title: "Update Session",
    component: UpdateSessionPage,
  },
  // --------------- USER ROLES ROUTES ---------------
  {
    path: "/api/user-roles",
    title: "List User Roles",
    component: ListUserRolesPage,
  },
  {
    path: "/api/user-roles/create",
    title: "Create User Role",
    component: AddRoleToUserPage,
  },
  {
    path: "/api/user-roles/:id",
    title: "Update User Role",
    component: UpdateUserRolePage,
  },
  // --------------- ROLE PERMISSIONS ROUTES ---------------
  {
    path: "/api/role-permissions",
    title: "List Role Permissions",
    component: ListRolePermissions,
  },
  {
    path: "/api/role-permissions/create",
    title: "Assign Role Permission",
    component: AddPermissionToRole,
  },
  // --------------- PROFILE ROUTES ---------------
  {
    path: '/api/profile',
    title: 'Profile',
    component: ProfilePage,
  },
  {
    path: '/api/profiles',
    title: 'List Profiles',
    component: ListProfilesPage,
  },
  {
    path: '/api/profiles/:id',
    title: 'Update Profile',
    component: UpdateProfilePage,
  },
  {
    path: '/api/profiles/create',
    title: 'Create Profile',
    component: CreateProfilePage,
  },
  {
    path: '/api/profiles/view/:id',
    title: 'View Profile',
    component: ViewProfilePage,
  },
  // --------------- PERMISSION ROUTES ---------------
  {
    path: '/api/permissions',
    title: 'List Permissions',
    component: ListPermissions,
  },
  {
    path: '/api/permissions/create',
    title: 'Create Permission',
    component: CreatePermissionPage,
  },
  {
    path: '/api/permissions/:id',
    title: 'Update Permission',
    component: UpdatePermissionPage,
  },
  // --------------- CORE ROUTES ---------------
  {
    path: '/demo',
    title: 'Demo',
    component: Demo,
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
