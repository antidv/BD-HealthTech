const app = require('./server/src/app');

async function main() {
  await app.listen(3000);
  console.log('Server running on port 3000');
}

main(); 