#!/usr/bin/env node

/**
 * Example: Using Securitas Direct API as a library
 * 
 * This shows how to use the SecuritasDirectClient in your own code.
 */

import { SecuritasDirectClient } from './dist/lib';

async function main() {
  // Create client instance
  const client = new SecuritasDirectClient();

  // Example 1: Authentication
  console.log('Example 1: Authentication');
  console.log('========================\n');

  // SECURITY: Never hardcode credentials. Use environment variables.
  const username = process.env.SECURITAS_USERNAME;
  const password = process.env.SECURITAS_PASSWORD;
  
  if (!username || !password) {
    console.error('Error: SECURITAS_USERNAME and SECURITAS_PASSWORD environment variables must be set');
    console.error('Example: SECURITAS_USERNAME=your-email@example.com SECURITAS_PASSWORD=your-password node dist/example.js');
    process.exit(1);
  }

  const authResult = await client.authenticate({
    username,
    password,
  });

  if (!authResult.success) {
    console.error(`Authentication failed: ${authResult.message}`);
    return;
  }

  console.log('✅ Authentication successful');
  const session = client.getSession();
  console.log(`Customer ID: ${session?.customerId}`);
  console.log(`Session ID: ${session?.sessionId}\n`);

  // Example 2: Get Installations
  console.log('Example 2: Get Installations');
  console.log('===========================\n');

  const installations = await client.getInstallations();
  console.log(`Found ${installations.length} installation(s):`);
  installations.forEach((inst) => {
    console.log(`  - ${inst.name} (${inst.installationId})`);
    console.log(`    Address: ${inst.address}`);
    console.log(`    Devices: ${inst.devices?.length || 0}`);
  });

  if (installations.length === 0) {
    console.log('No installations found');
    client.logout();
    return;
  }

  const installationId = installations[0].installationId;

  // Example 3: Check Alarm Status
  console.log('\nExample 3: Check Alarm Status');
  console.log('=============================\n');

  const status = await client.getStatus(installationId);
  console.log(`Installation: ${installationId}`);
  console.log(`Arm State: ${status.armState}`);
  console.log(`Status: ${status.status}`);
  console.log(`Last Activity: ${status.lastActivityTime}`);
  console.log(`Activity Type: ${status.lastActivityType}`);

  // Example 4: List Devices
  console.log('\nExample 4: List Devices');
  console.log('=======================\n');

  const devices = await client.getDevices(installationId);
  console.log(`Found ${devices?.length || 0} device(s):`);
  devices?.forEach((device: any) => {
    console.log(`  - ${device.name} (${device.type})`);
    console.log(`    Status: ${device.status}`);
    console.log(`    Last Update: ${device.lastUpdate}`);
  });

  // Example 5: Get Events
  console.log('\nExample 5: Recent Events');
  console.log('========================\n');

  const events = await client.getEvents(installationId, 5);
  console.log(`Last 5 events:`);
  events?.forEach((event: any) => {
    console.log(`  [${event.eventTime}] ${event.eventType}: ${event.description}`);
  });

  // Example 6: Arm the Alarm (COMMENTED OUT - uncomment to use)
  // console.log('\nExample 6: Arm Alarm');
  // console.log('====================\n');
  // const armResult = await client.arm(installationId, 'armed');
  // console.log(`Arm Result: ${armResult.message}`);

  // Example 7: Disarm the Alarm (COMMENTED OUT - uncomment to use)
  // console.log('\nExample 7: Disarm Alarm');
  // console.log('=======================\n');
  // const disarmResult = await client.disarm(installationId);
  // console.log(`Disarm Result: ${disarmResult.message}`);

  // Logout
  console.log('\nLogging out...');
  client.logout();
  console.log('✅ Logged out successfully\n');
}

// Run the example
main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
