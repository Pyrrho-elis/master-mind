# KrackTheKode 🎯

A modern implementation of the classic Mastermind game built with SvelteKit. Players must guess a 4-digit secret code using strategic feedback about correct digits and their positions.

## 🎮 How to Play

1. **Make a Guess**: Enter a 4-digit number with unique digits (no repeats)
2. **Get Feedback**: Receive two pieces of information:
   - **E (Exists)**: How many digits from your guess exist in the secret code
   - **C (Correct Position)**: How many digits are in the correct position
3. **Win**: Get C: 4 to win the game!
4. **Game Over**: You have 10 attempts to crack the code

## 🚀 Features

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Feedback**: Instant validation and helpful error messages
- **Game State Management**: Track attempts, wins, and losses
- **Accessibility**: Screen reader friendly with proper ARIA labels
- **Analytics**: Built-in tracking with Matomo
- **Confetti Celebration**: Visual celebration when you win!

## 🛠️ Tech Stack

- **Frontend**: SvelteKit 2.0
- **Styling**: Tailwind CSS
- **Testing**: Playwright
- **Analytics**: Matomo
- **Icons**: Svelte Icons
- **Notifications**: Svelte Toast

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd master-mind

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
npm run dev -- --open
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Install Playwright browsers (first time only)
npx playwright install
```

## 🏗️ Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Nav.svelte      # Navigation component
├── lib/                # Utility libraries
│   ├── confetti.min.js # Confetti animation
│   └── index.js        # General utilities
├── routes/             # SvelteKit routes
│   ├── +layout.svelte  # Root layout
│   ├── +page.svelte    # Main game page
│   └── rules/          # Game rules page
│       └── +page.svelte
└── app.css             # Global styles
```

## 🎯 Game Logic

The game generates a random 4-digit code using digits 1-9 (no zeros, no repeats). Players must guess this code using the feedback system:

- **E (Exists)**: Count of digits that exist in the secret code
- **C (Correct Position)**: Count of digits in the correct position

Example:

- Secret Code: 7249
- Player Guess: 1234
- Result: E: 2 (digits 2,4 exist), C: 1 (digit 2 is in correct position)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

Created by [PyrrhoOfElis](https://t.me/PyrrhoOfElis)

---

**Happy Code Cracking!** 🔐✨
