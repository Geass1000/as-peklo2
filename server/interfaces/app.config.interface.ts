
export interface IAppConfig {
	env ?: string;
	express ?: ICExpress;
	mongodb ?: ICMongoDB;
	crypto ?: ICCrypro;
}
export interface ICExpress {
	port ?: number;
}
export interface ICMongoDB {
	username : string;
	password : string;
	host : string;
	port : string;
	database : string;
}
export interface ICCrypro {
	salt ?: string;
	secret ?: string;
}
