import { Routes,RouterModule } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Attendance } from './pages/attendance/attendance';
import { Users } from "./pages/users/users";
import { authGuard } from './services/guards/auth.guard';
import { RegisterSuccess } from './pages/register-success/register-success';
import { StudentDashboard } from './pages/student-dashboard/student-dashboard';
import { TeacherDashboard } from './pages/teacher-dashboard/teacher-dashboard';
import { ScannerComponent } from './pages/scanner/scanner';
import { PenaltyManagement } from './pages/penalty-management/penalty-management';
import { Layout } from './shared/layout/layout';
import { MasterList } from './pages/admin/master-list/master-list';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public pages (no layout)
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'register-success', component: RegisterSuccess },

  // ✅ Protected pages that use the layout (navbar + sidebar)
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'student-dashboard', component: StudentDashboard },
      { path: 'teacher-dashboard', component: TeacherDashboard },
      { path: 'scanner', component: ScannerComponent },
      { path: 'attendance', component: Attendance },
      { path: 'users', component: Users },
      { path: 'admin/penalties', component: PenaltyManagement },
      {path: 'master-list', component: MasterList},
    ]
  },

  // Wildcard fallback
  { path: '**', redirectTo: 'login' }
];
