wget -q https://github.com/Upsidedly/sico/raw/main/releases/sico-latest.gz
gunzip sico-latest.gz

SICO_DIR="$HOME/.sico"
BIN_DIR="$SICO_DIR/bin"

if [ ! -d $SICO_DIR ]; then
  mkdir $SICO_DIR
  mkdir $BIN_DIR
fi

if [ -f "$BIN_DIR/sico" ]; then
  echo "previous sico instance found of version $($BIN_DIR/sico -V)"
  rm "$BIN_DIR/sico"
fi

mv sico-latest "$BIN_DIR/sico"
chmod 755 $BIN_DIR/sico
echo "sico version $($BIN_DIR/sico -V) installed successfully!"

echo -e "put this in your ~/.bashrc:\n\nexport PATH=$BIN_DIR:\$PATH"