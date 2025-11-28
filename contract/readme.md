

### Compile the Smart Contract

The Compact compiler generates TypeScript bindings and zero-knowledge circuits from the smart contract source code:

```bash

# Install contract dependencies and compile
cd contract && npm install
npm run compact    # Compiles the Compact contract
npm run build      # Copies compiled files to dist/
cd ..
```

Expected output:

```
> compact
> compact compile src/ballot.compact ./src/managed/ballot

Compiling 2 circuits:
  circuit "post" (k=14, rows=10070)
  circuit "takeDown" (k=14, rows=10087)

> build
> rm -rf dist && tsc --project tsconfig.build.json && cp -Rf ./src/managed ./dist/managed && cp ./src/ballot.compact ./dist

```
