// MIT © 2017 azu

import { App } from "../../domain/App/App";
import { AppFactory } from "../../domain/App/AppFactory";
import { NonNullableBaseRepository } from "./NonNullableBaseRepository";

export class AppRepository extends NonNullableBaseRepository<App> {}

export const appRepository = new AppRepository(AppFactory.create());
