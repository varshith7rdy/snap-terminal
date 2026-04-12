# Snap-Term

An intelligent terminal with AI-powered auto-completion that learns from your project's context.

## Features

- **Context-Aware Auto-Completion**: Reads your project's `CONTEXT.md` file to provide relevant command suggestions
- **Ghost Text Preview**: Shows suggested completions in gray text before you press Tab
- **Project-Specific Commands**: Automatically suggests commands based on your project's configuration
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Installation

```bash
npm install
```

## Usage

```bash
npm run dev
```

## Project Context

Snap-Term uses a `CONTEXT.md` file in your project root to understand available commands. Create or edit this file to define your project's commands.

Example `CONTEXT.md`:
```markdown
@Project Context

@commands
npm install
npm run build
npm test
git add .
git commit -m "message"
@Be efficient.
```

### Syntax

- `@Project Context` - Section header (optional description below)
- `@commands` - Start of commands section
- Each command on a new line after `@commands`
- `@` - Ends the commands section

## How It Works

1. On startup, Snap-Term reads the `CONTEXT.md` file in the current directory
2. Parses commands from the `@commands` section
3. As you type, it matches your input against known commands
4. Press Tab to accept the ghost text completion

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC