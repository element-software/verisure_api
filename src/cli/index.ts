import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import { SecuritasDirectClient } from '../lib';

const CONFIG_FILE = path.join(process.env.HOME || '.', '.securitas-config.json');

interface Config {
  username?: string;
  password?: string;
  installationId?: string;
}

class SecuritasCLI {
  private client: SecuritasDirectClient;
  private rl: readline.Interface;
  private config: Config = {};
  private running = true;

  constructor() {
    this.client = new SecuritasDirectClient('GB'); // Default to UK
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.loadConfig();
  }

  /**
   * Start the CLI interface
   */
  async start(): Promise<void> {
    console.log('\n🔒 Securitas Direct API Client');
    console.log('================================\n');

    // If no credentials in config, ask for authentication
    if (!this.config.username || !this.config.password) {
      await this.promptAuthentication();
    } else {
      // Try to authenticate with stored credentials
      const success = await this.authenticateWithConfig();
      if (!success) {
        await this.promptAuthentication();
      }
    }

    if (this.client.isAuthenticated()) {
      await this.mainMenu();
    } else {
      console.log('❌ Authentication failed. Exiting.');
    }
  }

  /**
   * Prompt for username and password
   */
  private async promptAuthentication(): Promise<void> {
    console.log('📋 Authentication Required\n');

    const username = await this.question('Username: ');
    const password = await this.question('Password: ', true);

    console.log('\n⏳ Authenticating...');
    const result = await this.client.authenticate({ username, password });

    if (result.success) {
      console.log('✅ Authentication successful!\n');
      this.config.username = username;
      this.config.password = password;
      this.saveConfig();
    } else {
      console.log(`❌ Authentication failed: ${result.message}\n`);
      const retry = await this.question('Try again? (y/n): ');
      if (retry.toLowerCase() === 'y') {
        await this.promptAuthentication();
      }
    }
  }

  /**
   * Authenticate with stored credentials
   */
  private async authenticateWithConfig(): Promise<boolean> {
    if (!this.config.username || !this.config.password) {
      return false;
    }

    console.log('⏳ Authenticating with stored credentials...');
    const result = await this.client.authenticate({
      username: this.config.username,
      password: this.config.password,
    });

    return result.success;
  }

  /**
   * Main menu loop
   */
  private async mainMenu(): Promise<void> {
    while (this.running) {
      console.log('\n📱 Main Menu');
      console.log('━━━━━━━━━━━━');
      console.log('1. View Installations');
      console.log('2. Check Alarm Status');
      console.log('3. Arm Alarm');
      console.log('4. Disarm Alarm');
      console.log('5. View Devices');
      console.log('6. View Events History');
      console.log('7. Settings');
      console.log('8. Logout');
      console.log('9. Exit\n');

      const choice = await this.question('Select an option (1-9): ');

      switch (choice) {
        case '1':
          await this.showInstallations();
          break;
        case '2':
          await this.checkStatus();
          break;
        case '3':
          await this.armAlarm();
          break;
        case '4':
          await this.disarmAlarm();
          break;
        case '5':
          await this.showDevices();
          break;
        case '6':
          await this.showEvents();
          break;
        case '7':
          await this.settings();
          break;
        case '8':
          this.logout();
          break;
        case '9':
          this.running = false;
          break;
        default:
          console.log('❌ Invalid option. Please try again.');
      }
    }

    console.log('\n👋 Goodbye!\n');
    this.rl.close();
  }

  /**
   * Show installations
   */
  private async showInstallations(): Promise<void> {
    console.log('\n⏳ Fetching installations...');
    try {
      const installations = await this.client.getInstallations();

      if (installations.length === 0) {
        console.log('No installations found.');
        return;
      }

      console.log('\n🏢 Installations:');
      console.log('─────────────────');
      installations.forEach((inst, index) => {
        console.log(`\n${index + 1}. ${inst.alias || inst.name}`);
        console.log(`   Number: ${inst.numinst}`);
        console.log(`   Panel: ${inst.panel}`);
        console.log(`   Address: ${inst.address}, ${inst.city}`);
      });

      // Store the first installation ID
      if (installations.length > 0) {
        this.config.installationId = installations[0].numinst;
        this.saveConfig();
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Check alarm status
   */
  private async checkStatus(): Promise<void> {
    const installationId = await this.selectInstallation();
    if (!installationId) return;

    console.log('\n⏳ Fetching alarm status...');
    try {
      const status = await this.client.getStatus(installationId);

      console.log('\n🚨 Alarm Status:');
      console.log('────────────────');
      console.log(`Status: ${status.status}`);
      console.log(`Last Update: ${status.timestampUpdate}`);

      if (status.exceptions && status.exceptions.length > 0) {
        console.log(`\n⚠️  Exceptions (${status.exceptions.length}):`);
        status.exceptions.slice(0, 5).forEach((exception) => {
          console.log(`   • ${exception.alias}: ${exception.status} (${exception.deviceType})`);
        });
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Arm the alarm
   */
  private async armAlarm(): Promise<void> {
    const installationId = await this.selectInstallation();
    if (!installationId) return;

    // Get installations to find panel
    const installations = await this.client.getInstallations();
    const installation = installations.find(i => i.numinst === installationId);
    if (!installation) {
      console.log('❌ Installation not found');
      return;
    }

    console.log('\n🔐 Arm Options:');
    console.log('1. Full Arm');
    console.log('2. Night Mode');
    console.log('3. Partial Arm\n');

    const option = await this.question('Select arm mode (1-3): ');
    const armModes: { [key: string]: string } = {
      '1': 'ARM1',
      '2': 'ARMNIGHT',
      '3': 'ARMDAY',
    };

    const armMode = armModes[option] || 'ARM1';

    console.log(`\n⏳ Arming alarm (${armMode})...`);
    try {
      const result = await this.client.arm(installationId, installation.panel, armMode);
      if (result.success) {
        console.log(`✅ ${result.message}`);
        if (result.referenceId) {
          console.log(`   Reference ID: ${result.referenceId}`);
        }
      } else {
        console.log(`⚠️ ${result.message}`);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Disarm the alarm
   */
  private async disarmAlarm(): Promise<void> {
    const installationId = await this.selectInstallation();
    if (!installationId) return;

    // Get installations to find panel
    const installations = await this.client.getInstallations();
    const installation = installations.find(i => i.numinst === installationId);
    if (!installation) {
      console.log('❌ Installation not found');
      return;
    }

    const confirm = await this.question(
      '⚠️  Are you sure you want to disarm the alarm? (y/n): '
    );
    if (confirm.toLowerCase() !== 'y') {
      console.log('Cancelled.');
      return;
    }

    console.log('\n⏳ Disarming alarm...');
    try {
      const result = await this.client.disarm(installationId, installation.panel);
      if (result.success) {
        console.log(`✅ ${result.message}`);
        if (result.referenceId) {
          console.log(`   Reference ID: ${result.referenceId}`);
        }
      } else {
        console.log(`⚠️ ${result.message}`);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Show devices
   */
  private async showDevices(): Promise<void> {
    console.log('\n⚠️  Device listing not yet implemented in GraphQL API');
    console.log('This feature will be added in a future update.\n');
    return;
  }

  /**
   * Show events history
   */
  private async showEvents(): Promise<void> {
    console.log('\n⚠️  Event history not yet implemented in GraphQL API');
    console.log('This feature will be added in a future update.\n');
    return;
  }

  /**
   * Settings menu
   */
  private async settings(): Promise<void> {
    console.log('\n⚙️  Settings');
    console.log('───────────');
    console.log('1. Change Credentials');
    console.log('2. Clear Stored Config');
    console.log('3. View Config');
    console.log('4. Back to Menu\n');

    const choice = await this.question('Select an option (1-4): ');

    switch (choice) {
      case '1':
        await this.promptAuthentication();
        break;
      case '2':
        this.config = {};
        this.saveConfig();
        console.log('✅ Config cleared.');
        break;
      case '3':
        console.log('\n📄 Configuration:');
        console.log(`Username: ${this.config.username || 'Not set'}`);
        console.log(`Installation ID: ${this.config.installationId || 'Not set'}`);
        break;
      case '4':
        break;
      default:
        console.log('❌ Invalid option.');
    }
  }

  /**
   * Logout
   */
  private logout(): void {
    this.client.logout();
    this.config = {};
    this.saveConfig();
    console.log('✅ Logged out successfully.');
    this.running = false;
  }

  /**
   * Select installation from list
   */
  private async selectInstallation(): Promise<string | null> {
    if (this.config.installationId) {
      return this.config.installationId;
    }

    try {
      const installations = await this.client.getInstallations();
      if (installations.length === 0) {
        console.log('❌ No installations found.');
        return null;
      }

      if (installations.length === 1) {
        return installations[0].numinst;
      }

      console.log('\n🏢 Select Installation:');
      installations.forEach((inst, index) => {
        console.log(`${index + 1}. ${inst.alias || inst.name}`);
      });

      const choice = await this.question('\nSelection: ');
      const index = parseInt(choice) - 1;

      if (index >= 0 && index < installations.length) {
        const selected = installations[index].numinst;
        this.config.installationId = selected;
        this.saveConfig();
        return selected;
      }

      console.log('❌ Invalid selection.');
      return null;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  /**
   * Load configuration from file
   */
  private loadConfig(): void {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
        this.config = JSON.parse(data);
      }
    } catch (error) {
      console.warn('⚠️  Could not load config file');
    }
  }

  /**
   * Save configuration to file
   */
  private saveConfig(): void {
    try {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2), 'utf-8');
    } catch (error) {
      console.warn('⚠️  Could not save config file');
    }
  }

  /**
   * Prompt user for input
   */
  private question(prompt: string, hidden: boolean = false): Promise<string> {
    return new Promise((resolve) => {
      if (hidden) {
        // Simple hidden input for password
        process.stdout.write(prompt);
        process.stdin.once('data', (data) => {
          process.stdout.write('\n');
          resolve(data.toString().trim());
        });
        process.stdin.setRawMode?.(true);
      } else {
        this.rl.question(prompt, (answer) => {
          resolve(answer.trim());
        });
      }
    });
  }

  /**
   * Format arm state for display
   */
  private formatArmState(state: string): string {
    const states: { [key: string]: string } = {
      armed: '🔴 Armed',
      disarmed: '🟢 Disarmed',
      armed_night: '🟠 Armed (Night)',
      armed_partial: '🟡 Armed (Partial)',
    };
    return states[state] || state;
  }

  /**
   * Format device status for display
   */
  private formatDeviceStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      ok: '✅ OK',
      open: '🔓 Open',
      closed: '🔒 Closed',
      triggered: '🚨 Triggered',
      offline: '❌ Offline',
      online: '✅ Online',
    };
    return statusMap[status.toLowerCase()] || status;
  }

  /**
   * Get icon for device type
   */
  private getDeviceIcon(type: string): string {
    const icons: { [key: string]: string } = {
      door: '🚪',
      window: '🪟',
      motion: '🚶',
      smoke: '💨',
      temperature: '🌡️',
      keypad: '⌨️',
      siren: '🔔',
    };
    return icons[type.toLowerCase()] || '📱';
  }

  /**
   * Handle and display errors
   */
  private handleError(error: any): void {
    if (error.code) {
      console.log(`\n❌ Error (${error.code}): ${error.message}`);
    } else if (error.message) {
      console.log(`\n❌ Error: ${error.message}`);
    } else {
      console.log('\n❌ An unknown error occurred.');
    }
  }
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const cli = new SecuritasCLI();
  await cli.start();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
