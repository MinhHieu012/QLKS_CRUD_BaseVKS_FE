import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { CommonComponent } from './common.component';
import { MessageService } from 'primeng/api';

export const AuthGuard: CanActivateFn = () => {
  const commonComponent = inject(CommonComponent);
  const messageService = inject(MessageService);
  const router = inject(Router);

  if (commonComponent.checkUserRoleOrLoggedIn()) {
    router.navigate(['/']);
    messageService.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Bạn đã đăng nhập rồi!',
    })
    return false;
  } else {
    return true;
  }
}
