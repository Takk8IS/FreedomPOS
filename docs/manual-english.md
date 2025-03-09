# Freedom POS Manual for Beginners

This simple manual will guide you through the entire process of downloading, installing, running and generating the web and desktop versions of Freedom POS.

## Table of Contents

1. [Basic Requirements](#basic-requirements)
2. [Downloading Freedom POS](#downloading-freedom-pos)
3. [Installation](#installation)
4. [Running the Web Version](#running-the-web-version)
5. [Running the Desktop Version](#running-the-desktop-version)
6. [Generating the Web Version Locally](#generating-the-web-version-locally)
7. [Generating the Desktop Versions](#generating-the-desktop-versions)
8. [Troubleshooting Common Problems](#troubleshooting-common-problems)

## Basic Requirements

To work with Freedom POS, you will need:

- A computer with Windows 10/11, macOS or Linux
- Internet access
- Approximately 4GB of free disk space
- At least 4GB of RAM (8GB recommended)

## Downloading Freedom POS

### For regular users (simplest way)

If you just want to use Freedom POS without modifying it:

1. Visit the releases page: [https://github.com/Takk8IS/FreedomPOS/releases](https://github.com/Takk8IS/FreedomPOS/releases)
2. Download the latest version for your operating system:
    - For Windows: `.msi` file
    - For macOS: `.dmg` file
    - For Linux: `.AppImage` or `.deb` file

### For developers and advanced users

If you want to modify, run or compile Freedom POS from the source code:

1. Install Git:

    - **Windows**: Download and install from the [official Git website](https://git-scm.com/download/win)
    - **macOS**: Open Terminal and type `xcode-select --install`
    - **Linux**: Use `sudo apt install git` (Ubuntu/Debian) or the equivalent command for your distribution

2. Open terminal (or command prompt on Windows)

3. Clone the repository with the command:

    ```
    git clone https://github.com/Takk8IS/FreedomPOS.git
    ```

4. Enter the project folder:
    ```
    cd FreedomPOS
    ```

## Installation

If you downloaded a pre-compiled version (`.msi`, `.dmg` or `.AppImage` file), simply run the installer and follow the on-screen instructions.

To work with the source code, follow these steps:

### 1. Install Node.js

Node.js is necessary to run and compile the project.

- **Windows/macOS**:

    1. Visit [https://nodejs.org/](https://nodejs.org/)
    2. Download the LTS version (recommended)
    3. Run the installer and follow the instructions

- **Linux**:
    ```
    sudo apt update
    sudo apt install nodejs npm
    ```

### 2. Install Rust (required for the desktop version)

- **Windows**:

    1. Download and run the [Rust installer](https://www.rust-lang.org/tools/install)
    2. Follow the on-screen instructions

- **macOS/Linux**:
    1. Open terminal and run:
        ```
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
        ```
    2. Follow the instructions and select the default installation
    3. After installation, close and reopen the terminal

### 3. Install additional dependencies for compilation

- **Windows**:

    1. Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
    2. During installation, select "Desktop Development with C++"

- **macOS**:

    ```
    xcode-select --install
    ```

- **Linux** (Ubuntu/Debian):
    ```
    sudo apt update
    sudo apt install libwebkit2gtk-4.0-dev build-essential libssl-dev libgtk-3-dev libappindicator3-dev librsvg2-dev
    ```

### 4. Install project dependencies

In the terminal, inside the project folder, run:

```
npm install
```

Wait for the installation to complete (it may take a few minutes).

## Running the Web Version

To run the web version locally:

1. In the terminal, in the project folder, run:

    ```
    npm run dev
    ```

2. Wait until you see a message indicating that the server is ready.

3. Open your browser and access:

    ```
    http://localhost:3000
    ```

4. To stop the server, return to the terminal and press `Ctrl+C`

## Running the Desktop Version

To run the desktop version during development:

1. In the terminal, in the project folder, run:

    ```
    npm run tauri dev
    ```

2. Wait for the compilation (it may take a few minutes the first time).

3. The desktop application will start automatically.

4. To exit, close the application window and press `Ctrl+C` in the terminal.

## Generating the Web Version Locally

To create a publishable version of the website:

1. In the terminal, in the project folder, run:

    ```
    npm run build
    ```

2. Wait for the build process to complete.

3. The web version files will be in the `out` folder.

4. To test locally, you can use:

    ```
    npx serve out
    ```

5. To publish, simply copy the contents of the `out` folder to your web server.

## Generating the Desktop Versions

### Generating for your current system

To generate a desktop version for the operating system you are using:

1. In the terminal, in the project folder, run:

    ```
    npm run tauri build
    ```

2. Wait for the build process to complete (it may take several minutes).

3. The installation files will be generated in the folder:

    ```
    src-tauri/target/release/bundle/
    ```

4. You will find the appropriate installer for your system:
    - Windows: `.msi` file
    - macOS: `.dmg` file and `.app` folder
    - Linux: `.AppImage`, `.deb` and other files depending on the distribution

### Generating for other operating systems

In general, it is **not possible** to directly compile an installer for a different operating system than the one you are using. For example, you cannot generate a macOS installer from Windows.

To generate installers for all systems, you have the following options:

#### Option 1: Use GitHub Actions (Recommended)

Freedom POS already has settings for automatic compilation. To use:

1. Fork the repository to your GitHub account
2. Make your desired changes to the code
3. Create a new version tag:
    ```
    git tag v1.0.x
    git push origin v1.0.x
    ```
4. GitHub Actions will automatically compile versions for Windows, macOS and Linux
5. You will be able to download the installers from the "Releases" section of your repository

#### Option 2: Use virtual machines or containers

You can configure virtual machines with different operating systems and compile on each of them.

## Troubleshooting Common Problems

### "Command not found" Error

- Check if Node.js is installed correctly
- Close and reopen the terminal
- Check if you are in the correct project folder

### Errors during npm install

- Check your internet connection
- Try running `npm cache clean --force` and then try again
- If you are on a corporate network, check the proxy settings

### Errors compiling the desktop version

- Check if Rust is installed correctly
- Run `rustup update` to update Rust
- Check if all system dependencies have been installed
- Check available disk space

### The web application doesn't open

- Check if the server is running (it should show messages in the terminal)
- Try accessing using another browser
- Check if port 3000 is not blocked by the firewall

### Desktop application window appears blank

- Check the logs in the terminal to identify errors
- Try reinstalling dependencies with `npm install`
- Check if your system meets the minimum requirements

### Where to get additional help

- Check the [official documentation](https://github.com/Takk8IS/FreedomPOS/docs/)
- Visit the [issues section](https://github.com/Takk8IS/FreedomPOS/issues) for known problems
- Create a new issue detailing your problem if you don't find a solution

---

This manual was created to help beginners work with Freedom POS. For more detailed information, refer to the complete documentation in the repository.

## Licence

Copyright (c)
License: Attribution 4.0 International (CC BY 4.0)
Author: David C Cavalcante

## Donations

If this project has been helpful, consider making a donation:

**USDT (TRC-20)**: `TP6zpvjt2ZNGfWKPevfp65ZrcbKMWSQXDi`

Your support helps us continue to develop innovative tools.

## Support

To contribute to public and social projects focused on research and artificial intelligence, feel free to support with any amount you prefer.

## About the Author

David C Cavalcante

- Philosopher & Writer, Artificial Intelligence Consultant Tech Lead, Researcher & Author, Strategic Marketing & Design Specialist, Developer & Software Engineer

- **LinkedIn**: [linkedin.com/in/hellodav](https://linkedin.com/in/hellodav/)
- **Medium**: [medium.com/@davcavalcante](https://medium.com/@davcavalcante/)

Takk™ Innovate Studio

- Positive results, rapid innovation
- Leading the Digital Revolution as the Pioneering 100% Artificial Intelligence Team

- **GitHub**: [github.com/takk8is](https://github.com/takk8is)
- **X**: [x.com/takk8is](https://x.com/takk8is/)
- **Medium**: [takk8is.medium.com](https://takk8is.medium.com/)
- **URL**: [takk.ag](https://takk.ag/)
