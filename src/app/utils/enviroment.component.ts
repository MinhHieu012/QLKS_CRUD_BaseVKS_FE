import { Injectable } from '@angular/core';

@Injectable({
     providedIn: 'root'
})

export class EnviromentComponent {
     local: String = 'http://localhost:8080'
     deloy: String = 'Your server IP or domain name'
}