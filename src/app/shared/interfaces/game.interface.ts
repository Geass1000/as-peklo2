export interface ISignin {
	uid : string;
	auth_key : string;
}
export interface IRSignin {
	token : string;
}

export interface IAcc extends ISignin, IRSignin {
}
export interface IRGameInfo {
	resources : IResources;
	armory : IArmory;
}

export interface IResources {
	metal : string;
	cristal : string;
	cordit : string;
	fuel : string;
}
export interface IArmory {
	air_strike : string;
	medicaments : string;
	gravibomb : string;
	shields : string;
	space_mines : string;
	repair_drones : string;
	adaptive_shield : string;
	ecm : string;
}

export interface ICost {
	type : string;
	cost : number;
}

export interface ICostArmory {
	air_strike : ICost;
	medicaments : ICost;
	gravibomb : ICost;
	shields : ICost;
	space_mines : ICost;
	repair_drones : ICost;
	adaptive_shield : ICost;
	ecm : ICost;
}
