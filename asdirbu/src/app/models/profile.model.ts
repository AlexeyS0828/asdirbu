export interface Profile {
    id: number;
	profileimage: string;
    name: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	bank_ac_no: string;
	uploaded_docs: []; 
	review: [];
	taxPay:number;
	serviceName:string;
	specialty:string;
	otherServiceName:string;
	otherSpecialty:string;
	service:string;
	aboutMe:string;
	hourlyRate:string;
	houseNumber:string;
	type:string;
	imageNameList:[];
	imageList:[];
	latitude:string;
	longitude:string;
}
