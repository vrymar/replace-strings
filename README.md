# replace-strings

This is a GitHub action to replace strings in files.

## Inputs

### `files`

**Required** A comma-separated list of files to replace strings in.

### `replacements`

**Required** A comma-separated list of replacements in the format `FIND=REPLACE`.

## Example usage

```yaml
uses: vrymar/replace-strings@v1
with:
  files: path/file,path_1/file_1
  replacements: OLD_STRING=NEW_STRING,OLD_STRING_1=NEW_STRING_1