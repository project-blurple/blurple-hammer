import type { Module } from "..";
import accessHandler from "./access";
import oauthHandler from "./oauth";

export default (client => {
  accessHandler(client);
  oauthHandler(client);
}) as Module;
