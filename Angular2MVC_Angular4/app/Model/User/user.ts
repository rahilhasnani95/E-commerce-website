import { ICompany } from '../../Model/Company/company';
import { Roles } from '../../Shared/enum';
export interface IUser {
   
    Id: number,
    FirstName: string,
    LastName: string,
    SecurityAnswer: string,
    Gender: string,
    Role: string,
    UserRole: Roles,
    UserName: string,
    Password: string,
    IsLocked: boolean,
    CompanyId: number,
    CompanyDetail: ICompany,
    URL: string
}