# Built package

`krohnkite.kwinscript` is the installable KWin script bundle built from the
source tree at the version tag that contains this directory.

Rebuild it with:

```sh
make clean
make package
cp krohnkite-<version>.kwinscript dist/krohnkite.kwinscript
```

The fixed filename lets Plasmarchy download the same path from either
`master` or a version tag.  Check the archive metadata for the embedded
version and source revision:

```sh
python3 - <<'PY'
import json, zipfile
print(json.loads(zipfile.ZipFile("dist/krohnkite.kwinscript").read("metadata.json")))
PY
```
