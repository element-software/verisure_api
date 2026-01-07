import { SecuritasDirectClient } from './src/lib';

async function testLogin() {
  console.log('Testing GraphQL Login...\n');
  
  const client = new SecuritasDirectClient('GB');
  
  // SECURITY: Never hardcode credentials. Use environment variables.
  const username = process.env.SECURITAS_USERNAME;
  const password = process.env.SECURITAS_PASSWORD;
  
  if (!username || !password) {
    console.error('Error: SECURITAS_USERNAME and SECURITAS_PASSWORD environment variables must be set');
    console.error('Please set these environment variables before running this test');
    process.exit(1);
  }
  
  const result = await client.authenticate({
    username,
    password,
    country: 'GB'
  });
  
  console.log('\n=== Authentication Result ===');
  console.log('Success:', result.success);
  console.log('Message:', result.message);
  
  if (result.success) {
    console.log('Hash (first 30 chars):', result.hash?.substring(0, 30) + '...');
  }
}

testLogin().catch(err => {
  console.error('Test failed:', err.message);
});
