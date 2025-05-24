export interface FarmType {
    id: string;
    name: string;
    farmType: string;
  }

export interface FarmSize{
    id: string;
    name: string;
    sizeType: string;
}

export interface FarmWaterSource{
    id: string;
    name: string;
    srcType: string;
}

export interface CreateFarm{
    name: string,
    size: string,
    type: string,
    watersrc: string,
    latitude: string,
    longitude: string,
    location: string,
    notes: string,
    device: string
}


export interface NewFarm {
    id: string;
    name: string;
    location: string;
    ownerId: string;
    createdAt: string;
}

export interface FarmOverview {
    pond: {
      do_mg_l: number;
      temp_c: number;
      total: number;
      devices: number;
      updatedAt: string
    };
    fish: {
      species: string;
      avgWeight: number;
      growthRate: number;
      totalStock: number;
      fcr: number;
      feedToday: number;
      daysInCycle: number;
      lastFeed: string
    }[];
  }