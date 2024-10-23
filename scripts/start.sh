#!/bin/bash

if pm2 show simplesst >/dev/null 2>&1; then
  pm2 restart simplesst
else
  pm2 start dist/main.js --name simplesst
fi
