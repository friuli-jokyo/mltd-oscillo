sudo chown vscode .pnpm-store
sudo chown vscode node_modules
sudo apt-get update
sudo apt-get install -y libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  fonts-takao
pnpm i