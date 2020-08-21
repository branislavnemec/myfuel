import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable()
export class IndexedDBService {

    constructor(private dbService: NgxIndexedDBService) {
    }

    isActivityAllowed(activityId: number, maxAttempts: number, period: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.dbService.getByKey('activities', activityId).then(
                (result) => {
                    console.log(result);
                    if (result === undefined ||
                        result.attempts < maxAttempts ||
                        (result.attempts === maxAttempts && Date.now() - result.timestamp > period)) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                (error) => {
                    console.log(error);
                    resolve(false);
                }
            ).catch(
                (error) => {
                    console.log(error);
                    resolve(false);
                }
            );
        });
    }

    logActivity(activityId: number, maxAttempts: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.dbService.getByKey('activities', activityId).then(
                (result) => {
                    console.log(result);
                    if (result === undefined) {
                        this.dbService.add('activities', {id: activityId, attempts: 1, timestamp: Date.now()}).then(
                            (res) => {
                                console.log(res);
                                resolve(true);
                            },
                            (error) => {
                                console.log(error);
                                resolve(false);
                            }
                        );
                    } else {
                        this.dbService.update('activities', {id: activityId, attempts: (result.attempts < maxAttempts ? result.attempts + 1 : 1), timestamp: Date.now()}).then(
                            (res) => {
                                console.log(res);
                                resolve(true);
                            },
                            (error) => {
                                console.log(error);
                                resolve(false);
                            }
                        );
                    }
                },
                (error) => {
                    console.log(error);
                    resolve(false);
                }
            ).catch(
                (error) => {
                    console.log(error);
                    resolve(false);
                }
            );
        });
    }

}
