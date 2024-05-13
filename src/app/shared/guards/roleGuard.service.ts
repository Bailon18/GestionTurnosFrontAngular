
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { TokenService } from '../services/token.service';



@Injectable({
  providedIn: 'root',
})
export class RoleGuardService implements CanActivate{

  constructor(private TokenService: TokenService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRole = route.data['expectedRole'];
    const userRoles = this.TokenService.getAuthorities();

    if (userRoles.includes(expectedRole)) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
  

}
