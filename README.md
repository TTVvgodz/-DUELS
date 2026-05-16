# WARZONE 1v1 FPS

A browser-based 1v1 first-person shooter. Best of 5. Random guns. Mobile + desktop.

## Deploy to Railway (3 steps)

1. Push this folder to a GitHub repo
2. Go to railway.app → New Project → Deploy from GitHub → pick your repo
3. Railway auto-detects Node.js and deploys. Done.

Your game is live at: `https://your-project.up.railway.app`

## Play

- Open your Railway URL
- Share it with a friend
- Both enter the SAME room code and click JOIN
- Game starts when both players connect

## Controls

**Desktop**
- WASD — move
- Mouse — look (click to lock)
- Left click — shoot
- Right click — aim down sights
- R — reload

**Mobile**
- Left joystick — move
- Swipe middle — look
- SHOOT button — fire
- AIM button — hold for ADS
- RELOAD button — reload

## Local dev

```bash
npm install
node server.js
# open http://localhost:3000
```
