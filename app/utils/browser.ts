import { UAParser } from "ua-parser-js";

export interface Browser {
  user_agent: string;
  name?: string;
  version?: string;
  device?: string;
  os?: string;
}

export const parseBrowserDetails = (userAgent: string): Browser => {
  const parser = new UAParser(userAgent);

  const device = `${parser.getDevice().vendor}${
    parser.getDevice().model ? " " + parser.getDevice().model : ""
  }`;
  const os = `${parser.getOS().name}${
    parser.getOS().version ? " " + parser.getOS().version : ""
  }`;

  return {
    user_agent: parser.getUA(),
    name: parser.getBrowser().name,
    version: parser.getBrowser().version,
    device: device.length ? device : undefined,
    os: os.length ? os : undefined,
  };
};
