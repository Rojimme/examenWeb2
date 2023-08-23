import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Chofer } from '../models/chofer';

@Injectable({
  providedIn: 'root',
})
export class ChoferService {
  constructor(private http: HttpClient) {}

  insert(chofer: Chofer): Observable<Chofer> {
    return this.http
      .post<Chofer>('http://localhost:3000/chofer', chofer)
      .pipe(catchError(this.handlerError));
  }

  handlerError(error: HttpErrorResponse) {
    let mensaje = 'Error';
    if (error?.error) {
      mensaje = error?.error?.mensaje;
    }

    return throwError(() => new Error(mensaje));
  }
}
