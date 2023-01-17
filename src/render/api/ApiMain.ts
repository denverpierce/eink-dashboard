import { TomClient } from "./sources/tom/tom.service";

if (!process.env['TOM_TOKEN']) {
  console.error('No Tom token found, exiting');
  process.exit();
}

const tomClient = TomClient(process.env.TOM_TOKEN || '');

export {
  tomClient
}