import { ApplicationConfig } from "@angular/core";
import { routes } from "./form.routes";
import { provideRouter } from "@angular/router";

export const formConfig: ApplicationConfig = {
    providers: [ provideRouter(routes)]
  };