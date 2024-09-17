import { Injectable } from '@angular/core';

@Injectable({
     providedIn: 'root'
})

export class EnviromentComponent {
     local: String = 'http://localhost:8080'
     deloy: String = 'http://103.69.97.125:8080'
}