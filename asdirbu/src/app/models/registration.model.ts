export interface Registration {
  email: string;
  password: string;
  name?: string;
  lastname?: string;
  service?: string;
  dob?: string;
  companyName?: string;
  companyCode?: string;
  sector?: string;
  userType: number;
}
