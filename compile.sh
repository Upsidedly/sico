#! usr/bin/bash

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

bun build --compile ./src/sico.ts
gzip ./sico
mv sico.gz "./releases/sico-$PACKAGE_VERSION.gz"
if [ -f ./releases/sico-latest.gz ]; then
  rm ./releases/sico-latest.gz
fi
cp "./releases/sico-$PACKAGE_VERSION.gz" "./releases/sico-latest.gz"