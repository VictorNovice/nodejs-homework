import { Connection, Model, Document } from 'mongoose';

import { City, CitiesRepository } from '..';

import { CityTypegoose } from './city.typegoose';

export class CitiesMongoRepository implements CitiesRepository {
  private readonly CityModel: Model<CityTypegoose & Document>;

  public constructor(connection: Connection) {
    this.CityModel = new CityTypegoose().getModelForClass(CityTypegoose, {
      existingConnection: connection
    });
  }

  public getAllCities(): Promise<Array<City>> {
    return this.CityModel.find({}).exec();
  }

  public getCity(cityId: number): Promise<City> {
    return this.CityModel.findOne({ id: cityId }).exec();
  }

  public async getRandomCity(): Promise<City> {
    const citiesCount = await this.CityModel.count({}).exec();
    const randomIndex = Math.floor(Math.random() * citiesCount);
    const randomCity = await this.CityModel.findOne({})
      .skip(randomIndex)
      .exec();
    return randomCity;
  }

  public async addOrUpdateCity(city: City): Promise<void> {
    const cityModel = new this.CityModel(city);
    await cityModel.save();
  }

  public deleteCity(cityId: number): Promise<void> {
    return this.CityModel.remove({ id: cityId }).exec();
  }

  public async initializeCities(cities: Array<City>): Promise<void> {
    await this.CityModel.remove({}).exec();
    await this.CityModel.insertMany(cities);
  }
}
