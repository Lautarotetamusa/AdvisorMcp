# MCP Server
MCP client and server tests. Manage advisors in natural language. \
The MCP client has two tools. get-advisors and update-advisor.

## Build
Set the DEEPSEEK_API_KEY
```
echo "DEEPSEEK_API_KEY=<your-api-key>" > .env
```

Server
```
cd server && npm run build && cd ..
```
Client
```
cd client && npm run build && cd ..
```

## Run
Server
you must run the server first
```
node server/build/index.js
```
Client
```
node client/build/index.js
```
