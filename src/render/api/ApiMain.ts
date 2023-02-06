import { isAxiosError } from "axios";
import { TomClient } from "./sources/tom/tom.service";

if (!process.env['TOM_TOKEN']) {
  console.error('No Tom token found, exiting');
  process.exit();
}

const tomClient = TomClient(process.env.TOM_TOKEN || '');

export const getAxiosLog = (error: any) => {
  if (isAxiosError(error)) {
    if (error.code && 'response' in error) {
      return error.code
    }
    else if (error.code && error.response) return `${error.code}: ${error.response}`;
  }
  return JSON.stringify(error)
}


export {
  tomClient
}