import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { CommonComponent } from './common.component';
import { MessageService } from 'primeng/api';

export const preventAccessBeforeLoginGuard: CanActivateFn = () => {
  const commonComponent = inject(CommonComponent);
  const messageService = inject(MessageService);
  const router = inject(Router);

  if (!commonComponent.checkUserRoleOrLoggedIn()) {
    router.navigate(['/login']);
    messageService.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Vui lòng đăng nhập để thao tác!'
    });
    return false;
  } else {
    return true;
  }
};
