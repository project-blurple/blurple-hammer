import type { Module } from "..";
import accessHandler from "./access";
import oauthHandler from "./oauth";

const module: Module = client => {
  accessHandler(client);
  oauthHandler(client);
};

export default module;
