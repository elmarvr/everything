/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */
import "sst"
export {}
import "sst"
declare module "sst" {
  export interface Resource {
    "Cloudflare": {
      "accountId": string
      "databaseId": string
      "token": string
      "type": "sst.sst.Linkable"
    }
    "GithubClientId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "GithubClientSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "Issuer": {
      "type": "sst.sst.Linkable"
      "url": string
    }
    "Web": {
      "type": "sst.cloudflare.StaticSite"
      "url": string
    }
  }
}
// cloudflare 
import * as cloudflare from "@cloudflare/workers-types";
declare module "sst" {
  export interface Resource {
    "Api": cloudflare.Service
    "Auth": cloudflare.Service
    "DB": cloudflare.D1Database
    "KV": cloudflare.KVNamespace
  }
}
