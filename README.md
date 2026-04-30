# Imposter Game

A mobile party game built with React Native and Expo. Players are secretly assigned roles — most get a secret word, but the imposter gets only a vague hint. Through discussion and voting, players try to identify the imposter before they blend in.

---

## Prerequisites

Make sure you have the following installed before getting started:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- [Expo Go](https://expo.dev/client) on your Android or iOS device

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ImposterGame.git
cd ImposterGame
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npx expo start
```

### 4. Open in Expo Go

- Open the **Expo Go** app on your phone
- Make sure your phone and PC are on the **same WiFi network**
- Scan the QR code shown in the terminal

> If scanning doesn't work, press `t` in the terminal to switch to **Tunnel mode**, then scan again.

---

## Project Structure

```
ImposterGame/
├── src/
│   ├── App.js
│   ├── GameContext.js
│   ├── HomeScreen.js
│   ├── GameSettingsScreen.js
│   ├── SettingsScreen.js
│   ├── AdvancedSettingsScreen.js
│   └── WordGame/
│       ├── GamePlayFunctions.js
│       ├── GenreSelectScreen.js
│       ├── PlayerNamesScreen.js
│       ├── RoleRevealScreen.js
│       ├── DiscussionScreen.js
│       ├── VotingScreen.js
│       ├── ResultsScreen.js
│       └── ImposterRevealScreen.js
├── assets/
│   ├── Images/
│   │   ├── HomeImage.png
│   │   ├── Logo.png
│   │   ├── Card_Image.png
│   │   └── Reveal_Image.png
│   └── Datasets/
│       └── WordData.json
├── app.json
├── eas.json
└── package.json
```

---

## How to Play

1. **Game Settings** — Set the number of players, imposters, and game mode
2. **Advanced Settings** — Toggle hints for imposter, show genre, or enable No Imposter Mode
3. **Select Genres** — Choose which word categories to include
4. **Player Names** — Enter the names of all players
5. **Role Reveal** — Pass the phone around — each player taps the card to secretly see their word (or imposter hint)
6. **Discussion** — A random player starts. Go around and describe your word without saying it
7. **Vote** — Each player votes for who they think the imposter is
8. **Results** — See who got the most votes
9. **Imposter Reveal** — Flip the card to reveal who the imposter actually was

---

## Known Limitations in Expo Go

- **Shake to reveal** does not work in Expo Go because shaking opens the Expo developer menu. Use the tap gesture instead, or build a [development build](https://docs.expo.dev/develop/development-builds/introduction/) to enable shake.

---

## Building an APK

To build a standalone APK for Android:

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

Download the APK from [expo.dev](https://expo.dev) and install it on your device.

---

## Dependencies

| Package | Purpose |
|---|---|
| `expo` | Core Expo SDK |
| `@react-navigation/native` | Navigation |
| `@react-navigation/native-stack` | Stack navigator |
| `@react-native-async-storage/async-storage` | Persistent settings |
| `expo-sensors` | Accelerometer for shake detection |
| `expo-splash-screen` | Splash screen control |
| `expo-asset` | Asset preloading |

---

## License

This project is for personal and educational use.