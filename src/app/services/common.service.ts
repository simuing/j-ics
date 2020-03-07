import { Injectable, Inject } from '@angular/core';

//service 선언 
//https://stackoverflow.com/questions/47530226/how-to-create-a-common-service-throughout-the-app-in-angular4

@Injectable()
export class CommonService {
    public leftMenuOpenFlag: boolean;

    constructor() {
        this.leftMenuOpenFlag = false;
    };
}  