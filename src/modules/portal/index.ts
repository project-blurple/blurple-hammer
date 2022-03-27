import type { Module } from "..";
import accessHandler from "./access";
import oauthHandler from "./oauth";

export default (async client => {
  await accessHandler(client);
  await oauthHandler(client);
}) as Module;
