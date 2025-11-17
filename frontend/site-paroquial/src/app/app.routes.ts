import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Biblia } from './pages/biblia/biblia';
import { Noticias } from './pages/noticias/noticias';
import { Grupos } from './pages/grupos/grupos';
import { LiturgiaDiariaPage } from './pages/liturgia-diaria/liturgia-diaria';
import { CalendarioLiturgico } from './pages/calendario-liturgico/calendario-liturgico';
import { HorariosMissas } from './pages/horarios-missas/horarios-missas';
import { Contato } from './pages/contato/contato';
import { AdminLoginComponent } from './pages/admin-login/admin-login';
import { AdminComponent } from './pages/admin/admin';
import { AdminSantosList } from './pages/admin/admin-santos-list/admin-santos-list';
import { AdminEventosList } from './pages/admin/admin-eventos-list/admin-eventos-list';
import { AdminNoticiasList } from './pages/admin/admin-noticias-list/admin-noticias-list';
import { AdminPastoraisList } from './pages/admin/admin-pastorais-list/admin-pastorais-list';
import { AdminEventosForm } from './pages/admin/admin-eventos-form/admin-eventos-form';
import { AdminNoticiasForm } from './pages/admin/admin-noticias-form/admin-noticias-form';
import { AdminPastoraisForm } from './pages/admin/admin-pastorais-form/admin-pastorais-form';
import { AdminSantosForm } from './pages/admin/admin-santos-form/admin-santos-form';
import { AuthGuard } from './shared/guards/auth-guard';

export const routes: Routes = [
  // Rotas públicas
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'biblia', component: Biblia },
  { path: 'noticias', component: Noticias },
  { path: 'grupos', component: Grupos },
  { path: 'liturgia-diaria', component: LiturgiaDiariaPage },
  { path: 'calendario-liturgico', component: CalendarioLiturgico },
  { path: 'horarios-missas', component: HorariosMissas },
  { path: 'contato', component: Contato },
  
  // Rota de login administrativo
  { path: 'admin-login', component: AdminLoginComponent },
  
  // Rotas administrativas (SEM PROTEÇÃO TEMPORARIAMENTE)
  {
    path: 'admin',
    component: AdminComponent,
    // canActivate: [AuthGuard], // DESABILITADO TEMPORARIAMENTE
    children: [
      { path: '', redirectTo: 'eventos', pathMatch: 'full' },
      { path: 'eventos/novo', component: AdminEventosForm },
      { path: 'eventos/:id', component: AdminEventosForm },
      { path: 'eventos', component: AdminEventosList },
      { path: 'noticias/novo', component: AdminNoticiasForm },
      { path: 'noticias/:id', component: AdminNoticiasForm },
      { path: 'noticias', component: AdminNoticiasList },
      { path: 'pastorais/novo', component: AdminPastoraisForm },
      { path: 'pastorais/:id', component: AdminPastoraisForm },
      { path: 'pastorais', component: AdminPastoraisList },
      { path: 'santos/novo', component: AdminSantosForm },
      { path: 'santos/:id', component: AdminSantosForm },
      { path: 'santos', component: AdminSantosList }
    ]
  },
  
  // Rota wildcard para páginas não encontradas
  { path: '**', redirectTo: '' }
];
