import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config(
  globalIgnores(
    ["dist/**/*", "scripts/**/*"],
    "Ignore build and scripts directory",
  ),
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
);
