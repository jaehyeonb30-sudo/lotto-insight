#!/bin/bash
set -e
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
 echo "Node.js가 없습니다. https://nodejs.org/ 에서 LTS를 설치하세요."
 read -r -p "엔터를 누르면 종료합니다..."
 exit 1
fi
if [ ! -d node_modules ]; then npm install; fi
printf '
브라우저에서 http://localhost:3000 을 여세요. 종료하려면 Ctrl+C
'
npm run dev
