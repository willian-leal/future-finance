import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export abstract class BaseApiService { protected http = inject(HttpClient); protected readonly api = 'http://localhost:5000/api'; }
