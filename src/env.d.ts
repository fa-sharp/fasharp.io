/// <reference path="../.astro/actions.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    reqId: string;
    startTime: number;
  }
}
