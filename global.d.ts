// import shell from "./src/utils/shell.mjs";

declare var Options;

// declare module "./src/utils/shell.mjs" {
//   export const shell: (commands: string[], options: any) => { success: boolean; res?: any; err?: any };
// }

declare module "./src/utils/shell.mjs" {
  export const shell: (commands: string[], options: any) => { success: boolean; res?: any; err?: any };
}

// export const shell: (commands: string[], options: any) => { success: boolean; res?: any; err?: any };
