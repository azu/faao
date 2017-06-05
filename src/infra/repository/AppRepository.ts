// MIT © 2017 azu
"use strict";
import { BaseRepository } from "./BaseRepository";
import { App } from "../../domain/App/App";
import { AppFactory } from "../../domain/App/AppFactory";

export class AppRepository extends BaseRepository<App> {}

export const appRepository = new AppRepository(AppFactory.create());
