/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */
import "sst"
export {}
declare module "sst" {
  export interface Resource {
    "Auth": {
      "type": "sst.cloudflare.Worker"
      "url": string
    }
    "GithubClientId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GithubClientSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "KV": {
      "type": "sst.cloudflare.Kv"
    }
    "Web": {
      "type": "sst.cloudflare.StaticSite"
      "url": string
    }
  }
}