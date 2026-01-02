import { SecuritasDirectClient } from './src/lib';

async function testLogin() {
  console.log('Testing GraphQL Login...\n');
  
  const client = new SecuritasDirectClient('GB');
  
  // Use test credentials
  const result = await client.authenticate({
    username: 'test-user',
    password: 'test-pass',
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
