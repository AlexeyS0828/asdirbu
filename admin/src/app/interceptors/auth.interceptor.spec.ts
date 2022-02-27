import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthInterceptor
      ],
      imports: [HttpClientTestingModule, RouterTestingModule]
  }));

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
