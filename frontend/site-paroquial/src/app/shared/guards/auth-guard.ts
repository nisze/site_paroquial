import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (this.authService.isAuthenticated()) {
      // Verificar role específica se necessário
      const requiredRole = route.data['role'];
      
      if (requiredRole === 'ADMIN' && !this.authService.isAdmin()) {
        // Usuário não tem permissão de admin
        this.router.navigate(['/admin']);
        return false;
      }
      
      return true;
    }

    // Não autenticado - redirecionar para login
    this.router.navigate(['/admin-login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}
