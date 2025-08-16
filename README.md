# 🎭 Incremental Comedy

A fun incremental/idle game where you build your comedy empire from telling jokes to running TV shows!

## 🎮 How to Play

- **Tell a Joke**: Click the "Tell a Joke" button to earn laughs manually
- **Hire Joke Writers**: Automatically generate laughs over time
- **Build Comedy Clubs**: Increase your laugh production
- **Launch TV Shows**: Reach millions of viewers for massive laugh generation

## 🚀 Features

- **Incremental Gameplay**: Classic idle game mechanics with exponential growth
- **Auto-save**: Your progress is automatically saved every 30 seconds
- **Responsive Design**: Works great on desktop and mobile devices
- **Visual Feedback**: Smooth animations and hover effects
- **Easter Eggs**: Random jokes appear when you manually tell jokes!

## 🛠️ Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/incremental-comedy.git
   cd incremental-comedy
   ```

2. **Open in your browser**:
   - Simply open `index.html` in any modern web browser
   - Or serve it locally using a simple HTTP server

3. **For local development**:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

## 🌐 GitHub Pages

This game is designed to work perfectly with GitHub Pages:

1. Push your code to GitHub
2. Enable GitHub Pages in your repository settings
3. Select "Deploy from a branch" → "main" branch → "/ (root)"
4. Your game will be available at `https://YOUR_USERNAME.github.io/incremental-comedy`

## 🎨 Customization

The game is built with vanilla HTML, CSS, and JavaScript, making it easy to customize:

- **Add new upgrades**: Modify the `upgrades` object in `game.js`
- **Change colors**: Update the CSS variables in `styles.css`
- **Add new features**: Extend the game logic in `game.js`

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎯 Game Balance

The game is balanced for a satisfying progression curve:
- **Joke Writer**: 0.1 laughs/second, costs 10 laughs (scales by 1.15x)
- **Comedy Club**: 1 laugh/second, costs 50 laughs (scales by 1.15x)
- **TV Show**: 10 laughs/second, costs 500 laughs (scales by 1.15x)

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the game!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Have fun building your comedy empire! 🎭✨** 