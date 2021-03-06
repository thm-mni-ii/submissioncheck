import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Submission} from '../model/Submission';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  constructor(private http: HttpClient) { }

  /**
   * Load all submission for a task
   * @param uid User id
   * @param cid Course id
   * @param tid Task id
   * @param passed Filters only passed submissions
   * @return Observable that succeeds with all submission of a user for a task
   */
  getAllSubmissions(uid: number, cid: number, tid: number, passed?: boolean): Observable<any> {
    // TODO: do we need passed filter?
    return this.http.get<any>(`/api/v1/users/${uid}/courses/${cid}/tasks/${tid}/submissions`);
  }

  /**
   * Restart an already submitted submission. The submission will be checked again
   * @param uid User id
   * @param cid Course id
   * @param tid Task id
   * @param sid submission id
   * @return Observable that succeeds if operation submission was restated
   */
  restartSubmission(uid: number, cid: number, tid: number, sid: number): Observable<void> {
    return this.http.put<void>(`/api/v1/users/${uid}/courses/${cid}/tasks/${tid}/submissions/${sid}`, {});
  }

  /**
   * Load a single submission
   * @param uid User id
   * @param cid Course id
   * @param tid Task id
   * @param sid submission id
   * @return Observable that succeeds with the submission
   */
  getSubmission(uid: number, cid: number, tid: number, sid: number): Observable<Submission> {
    return this.http.get<Submission>(`/api/v1/users/${uid}/courses/${cid}/tasks/${tid}/submissions/${sid}`);
  }

  // POST /users/{uid}/courses/{cid}/tasks/{tid}/submissions
  submitSolution(uid: number, cid: number, tid: number, solution: File | string): Observable<Submission> {
    const formData: FormData = new FormData();
    formData.append('file', (<any>solution).name ? solution : new Blob([solution]));
    return this.http.post<Submission>(`/api/v1/users/${uid}/courses/${cid}/tasks/${tid}/submissions`, formData);
  }

  // PUT /users/{uid}/courses/{cid}/tasks/{tid}/submissions/
  restartAllSubmissions(uid: number, cid: number, tid: number, sid: number) {
    // TODO: this Route doesn't exist yet
  }
}
