/**
 * VDK Hub Client
 * -----------------------
 * This module is responsible for all communication with the VDK Hub,
 * which includes fetching rule lists, downloading rule files, and checking for updates.
 */

import https from 'https';
import ora from 'ora';
import chalk from 'chalk';

const HUB_REPO_API_URL = 'https://api.github.com/repos/entro314-labs/VibeKit-VDK-AI-rules/contents/.ai/rules?ref=main';

/**
 * Fetches the list of available rules from the VDK Hub.
 * @returns {Promise<Array>} A promise that resolves to an array of rule file objects.
 */
async function fetchRuleList() {
  const spinner = ora('Connecting to VDK Hub...').start();
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
    };

    // Use GitHub token if available to avoid rate limiting
    if (process.env.VDK_GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.VDK_GITHUB_TOKEN}`;
    } else {
      spinner.warn('VDK_GITHUB_TOKEN not set. You may encounter rate limiting.');
    }

    const response = await fetch(HUB_REPO_API_URL, { headers });

    if (!response.ok) {
      spinner.fail('Failed to connect to VDK Hub.');
      throw new Error(`Failed to fetch rule list. Status: ${response.status}`);
    }

    const data = await response.json();
    spinner.succeed('Successfully connected to VDK Hub.');
    return data.filter(item => item.type === 'file' && item.name.endsWith('.mdc'));
  } catch (error) {
    // Ora spinner might not be initialized if fetch fails, so check before using
    if (ora.isSpinning) {
        ora().stop();
    }
    console.error(chalk.red(`Error: ${error.message}`));
    return [];
  }
}

/**
 * Downloads the content of a specific rule file.
 * @param {string} downloadUrl - The URL to download the file from.
 * @returns {Promise<string>} A promise that resolves to the content of the file.
 */
async function downloadRule(downloadUrl) {
  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to download rule. Status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(chalk.red(`Error downloading rule from ${downloadUrl}: ${error.message}`));
    return null;
  }
}

export { fetchRuleList, downloadRule };
