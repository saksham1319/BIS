import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const rootDir = process.cwd();

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    let target = path.join(rootDir, specifier.slice(2));
    if (!path.extname(target)) {
      if (fs.existsSync(target + ".ts")) target = target + ".ts";
      else if (fs.existsSync(target + ".tsx")) target = target + ".tsx";
      else if (fs.existsSync(target + "/index.ts")) target = target + "/index.ts";
    }
    return nextResolve(pathToFileURL(target).href, context);
  }

  if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL) {
    const parentFile = fileURLToPath(context.parentURL);
    const parentDir = fs.statSync(parentFile).isDirectory() ? parentFile : path.dirname(parentFile);
    let target = path.resolve(parentDir, specifier);
    if (!path.extname(target)) {
      if (fs.existsSync(target + ".ts")) target = target + ".ts";
      else if (fs.existsSync(target + ".tsx")) target = target + ".tsx";
      else if (fs.existsSync(target + "/index.ts")) target = target + "/index.ts";
    }
    if (fs.existsSync(target)) {
      return nextResolve(pathToFileURL(target).href, context);
    }
  }

  return nextResolve(specifier, context);
}
