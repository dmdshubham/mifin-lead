import { ESLint } from "eslint";
import { promises as fs } from "fs";
import * as path from "path";

const cwd = process.cwd();
const eslint = new ESLint({ cwd });

let formatter: ESLint.Formatter | null = null;

export default (
  options = { extNames: [".js", ".jsx", ".ts", ".tsx", ".vue"] }
) => {
  return {
    transforms: [
      {
        test({ path: filepath }: { path: string }) {
          return (
            filepath.startsWith(cwd) &&
            filepath.indexOf("node_modules") < 0 &&
            options.extNames.includes(path.extname(filepath))
          );
        },
        async transform({
          code,
          path: filepath,
        }: {
          code: string;
          path: string;
        }) {
          if (!formatter) {
            formatter = await eslint.loadFormatter("stylish");
          }

          const lintResultList = await eslint.lintText(
            await fs.readFile(filepath, { encoding: "utf8" }),
            {
              filePath: filepath,
              warnIgnored: false,
            }
          );

          if (lintResultList && lintResultList.length) {
            const text = formatter.format(lintResultList);

            if (text && text.trim().length) {
              console.log(text);
            }
          }

          return code;
        },
      },
    ],
  };
};
