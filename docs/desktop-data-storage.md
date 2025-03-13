# FreedomPOS Desktop Data Storage System

This document explains how data is stored and persisted in the desktop version of FreedomPOS, which is built using Tauri and Next.js.

## Overview

FreedomPOS desktop application uses **IndexedDB** as its primary data storage solution. IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs. This document explains how this system works in the desktop environment.

## How IndexedDB Works in Desktop

In the desktop version of FreedomPOS:

1. **Tauri Framework**: The application is built using Tauri, which embeds a WebView component
2. **WebView Storage**: The WebView component (based on the system's native browser engine) provides IndexedDB functionality
3. **Persistence Layer**: Data is automatically persisted to the local file system

Unlike traditional web applications where IndexedDB data might be cleared by the browser, the desktop version maintains stable, persistent storage that survives application restarts and system reboots.

## File System Locations

IndexedDB data is stored in the following locations based on operating system:

| Operating System | Data Location |
|-----------------|---------------|
| Windows | `C:\Users\[USERNAME]\AppData\Local\com.freedompos.dev\` |
| macOS | `~/Library/Application Support/com.freedompos.dev/` |
| Linux | `~/.config/com.freedompos.dev/` |

Within these directories, you'll find subdirectories containing the IndexedDB database files for FreedomPOS (typically under names containing `IndexedDB`).

## Data Persistence Example

Here's how data persistence works in a practical scenario:

1. **Day 1 - Business Operations**:
   - Products, sales, and customer data are entered into FreedomPOS
   - Data is stored in IndexedDB
   - IndexedDB persists the data to the file system in the background

2. **End of Day**:
   - Application is closed
   - Computer is shut down

3. **Day 2 - Business Reopens**:
   - Computer is turned on
   - FreedomPOS application is launched
   - All previous data is automatically loaded from the persistent IndexedDB storage
   - Business operations continue with all historical data intact

## Database Structure

The current database (`hipos`, version 2) contains the following object stores:

1. **`users`** - Store for user accounts:
   - Primary key: `id`
   - Index: `by-email` (unique)
   - Fields include: name, email, password (hashed), role, etc.

2. **`products`** - Store for inventory:
   - Primary key: `id`
   - Fields include: name, description, price, stock, category, etc.

## Backup Recommendations

Since all data is stored locally on the device, implementing a backup strategy is crucial:

### Manual Backup

1. Locate the application data directory for your operating system (listed above)
2. Copy the entire directory to a backup location (external drive, cloud storage)
3. Store backups in a secure location

### Automated Backup

1. Use scheduled tasks/cron jobs to automate backing up the data directory
2. Consider using backup software that can handle application data directories
3. Set up regular backup intervals (daily for business-critical data)

## Limitations and Considerations

Using IndexedDB in the desktop version has some limitations to be aware of:

1. **Single-Device Storage**: Data is stored only on the local device
2. **No Built-in Synchronization**: Multiple devices running FreedomPOS will have separate, independent databases
3. **Storage Limits**: While modern systems have generous storage limits, very large datasets might experience performance degradation
4. **Data Integrity**: Hardware failures could potentially lead to database corruption
5. **No Built-in Encryption**: Sensitive data is stored on disk (although password hashing is implemented)

## Recommendations for Multi-Device Setups

For businesses using FreedomPOS on multiple devices:

1. **Designate a Primary Device**: Use one device as the main POS terminal
2. **Regular Data Exports**: Implement regular data export procedures
3. **Consider Custom Sync Solutions**: For advanced needs, consider developing custom synchronization mechanisms

## Future Enhancements

Potential improvements to the data storage system:

1. **Encrypted Storage**: Add encryption layer for sensitive data
2. **Cloud Synchronization**: Optional sync with cloud storage
3. **Multi-Device Support**: Peer-to-peer synchronization for multi-terminal setups
4. **Automated Backup System**: Built-in backup functionality
5. **Data Migration Tools**: Easy migration between devices

## Troubleshooting

If you encounter data-related issues:

1. **Application Not Loading Data**: Check if the IndexedDB directories exist and have proper permissions
2. **Data Corruption**: Restore from the most recent backup
3. **Performance Issues**: Consider database maintenance (like clearing old, unnecessary records)

