import { SecuritasDirectClient } from '../lib';

/**
 * Example usage of the Securitas Direct GraphQL API client
 */
async function main() {
  try {
    // Initialize client with country code
    const client = new SecuritasDirectClient('GB'); // GB for UK

    console.log('=== Securitas Direct GraphQL API Example ===\n');

    // Authenticate
    console.log('1. Authenticating...');
    const authResult = await client.authenticate({
      username: 'admin', // Replace with your username
      password: 'test', // Replace with your password
      country: 'GB',
    });

    if (!authResult.success) {
      console.error('Authentication failed:', authResult.message);
      return;
    }

    console.log('✓ Authentication successful');
    console.log('  Hash:', authResult.hash?.substring(0, 20) + '...');
    console.log('');

    // Get installations
    console.log('2. Fetching installations...');
    const installations = await client.getInstallations();
    console.log(`✓ Found ${installations.length} installation(s)`);
    
    if (installations.length > 0) {
      const installation = installations[0];
      console.log('  First installation:');
      console.log('    Number:', installation.numinst);
      console.log('    Alias:', installation.alias);
      console.log('    Panel:', installation.panel);
      console.log('    Address:', installation.address);
      console.log('');

      // Get status
      console.log('3. Getting alarm status...');
      const status = await client.getStatus(installation.numinst);
      console.log('✓ Alarm status:', status.status);
      console.log('  Last update:', status.timestampUpdate);
      if (status.exceptions && status.exceptions.length > 0) {
        console.log('  Exceptions:', status.exceptions.length);
      }
      console.log('');

      // Optionally arm/disarm (commented out for safety)
      /*
      console.log('4. Arming panel...');
      const armResult = await client.arm(
        installation.numinst,
        installation.panel,
        'ARM1' // Full arm
      );
      console.log('✓ Arm result:', armResult.message);
      console.log('  Reference ID:', armResult.referenceId);
      console.log('');
      */
    }

    console.log('=== Example completed successfully ===');
  } catch (error: any) {
    console.error('Error:', error.message || error);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

// Run the example
main();
