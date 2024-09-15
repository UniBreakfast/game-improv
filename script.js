const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const cellRatio = 1/17;
let rowCount, columnCount, mapX, mapY;
const player = {
  x: 0,
  y: 0,
  row: 0,
  column: 0,
}
const viewPort = {
  x: 0,
  y: 0,
}

const elements = {
  player: createPlayerElement(),
  map: createMapElement(),
}

calculateViewport()

const map = generateMap();

renderMap();
renderPlayer();

window.onkeydown = handlePlayerAction;
window.onresize = renderMap;

function generateMap() {
  const map = [];

  for (let y = 0; y < rowCount; y++) {
    const row = [];

    for (let x = 0; x < columnCount; x++) {
      row.push(Math.floor(Math.random() * 4));
    }

    map.push(row);
  }

  mapX = -Math.floor(columnCount / 2);
  mapY = -Math.floor(rowCount / 2);

  return map;
}

function updateMap() {
  if (mapX > viewPort.x - Math.floor(columnCount / 2)) {
    mapX--;

    for (let i = 0; i < map.length; i++) {
      map[i].unshift(map[i].pop());
    }

  } else if (map[0].length < Math.ceil(columnCount / 2) + viewPort.x - mapX) {
    mapX++;

    for (let i = 0; i < map.length; i++) {
      map[i].push(map[i].shift());
    }
  }

  if (viewPort.y < mapY + Math.floor(rowCount / 2)) {
    mapY--;

    map.unshift(map.pop());

  } else if (map.length < Math.ceil(rowCount / 2) + viewPort.y - mapY) {
    mapY++;

    map.push(map.shift());
  }
}

function handlePlayerAction(event) {
  const { key } = event;
  
  if (arrows.includes(key)) handleMovement(event);
}

function handleMovement(event) {
  const { key } = event;
  const direction = key.replace('Arrow', '');

  if (isBlocked(direction)) return;
  
  movePlayer(direction);

  renderMap();//TODO: only render the affected area
  renderPlayer();
}

function isBlocked(direction) {
  const { x, y } = player;
  let tileX = x;
  let tileY = y;

  if (direction === 'Up') tileY--;
  else if (direction === 'Down') tileY++;
  else if (direction === 'Left') tileX--;
  else if (direction === 'Right') tileX++;

  const i = tileY - mapY;
  const j = tileX - mapX;
  
  const tile = map[i][j];

  return !tile;
}

function movePlayer(direction) {
  if (direction === 'Up') {
    player.y--;
    player.row--;

  } else if (direction === 'Down') {
    player.y++;
    player.row++;
  
  } else if (direction === 'Left') {
    player.x--;
    player.column--;

  } else if (direction === 'Right') {
    player.x++;
    player.column++;
  }

  const maxColumn = Math.floor(columnCount / 2) - 4;
  const minColumn = -maxColumn;
  const maxRow = Math.floor(rowCount / 2) - 4;
  const minRow = -maxRow;
  
  if (player.column < minColumn) {
    player.column = minColumn;
    viewPort.x--;
    updateMap();

  } else if (player.column > maxColumn) {
    player.column = maxColumn;
    viewPort.x++;
    updateMap();
  }

  if (player.row < minRow) {
    player.row = minRow;
    viewPort.y--;
    updateMap();

  } else if (player.row > maxRow) {
    player.row = maxRow;
    viewPort.y++;
    updateMap();
  }
}

function calculateViewport() {
  const cellSize = Math.min(innerWidth, innerHeight) * cellRatio;

  columnCount = Math.floor(innerWidth / cellSize);
  rowCount = Math.floor(innerHeight / cellSize);

  if (columnCount % 2 == 0) columnCount--;
  if (rowCount % 2 == 0) rowCount--;
}

function renderMap() {
  const mapElement = elements.map;
  const minRow = viewPort.y - Math.floor(rowCount / 2);
  const maxRow = minRow + rowCount;
  const minColumn = viewPort.x - Math.floor(columnCount / 2);
  const maxColumn = minColumn + columnCount;
  
  calculateViewport();
  
  body.append(mapElement);
  mapElement.innerHTML = '';

  for (let y = minRow; y < maxRow; y++) {
    for (let x = minColumn; x < maxColumn; x++) {
      const i = y - mapY;
      const j = x - mapX;
      const tile = map[i][j];
      const tileElement = document.createElement('map-tile');

      tileElement.classList.add(tile ? 'grass' : 'wall');

      mapElement.append(tileElement);
    }
  }

  body.style.setProperty('--column-count', columnCount);
  body.style.setProperty('--row-count', rowCount);
}

function renderPlayer() {
  const playerElement = elements.player;
  const { row, column } = player;

  elements.map.append(playerElement);

  playerElement.style.translate = `${column * 100}% ${row * 100}%`;
}

function createMapElement() {
  const mapElement = document.createElement('game-map');

  mapElement.id = 'map';

  return mapElement;
}

function createPlayerElement() {
  const playerElement = document.createElement('player-character');

  playerElement.id = 'player';

  return playerElement;
}
