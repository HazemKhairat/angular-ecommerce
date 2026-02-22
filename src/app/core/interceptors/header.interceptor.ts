import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
    if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            req = req.clone({
                setHeaders: {
                    token: token
                }
            });
        }
    }
    return next(req);
};
